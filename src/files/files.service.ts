import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './repositories/files.repository';
import { S3Service } from '../aws/s3/s3.service';
import { CreateFileDto } from './dto/createFile.dto';
import { GetFilesOutputDto } from './dto/getFiles.dto';
import { StatsResponseDto } from './dto/statsOutput.dto';
import { mapperFileToOutputDto } from './mappers/files.mapper';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileRepository: FilesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    data: CreateFileDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<GetFilesOutputDto> {
    const fileUrl = await this.s3Service.uploadFile(file);
    console.log('File uploaded to S3:', fileUrl);
    const newFile = await this.fileRepository.createFile({
      ...data,
      fileUrl,
      userId,
    });
    console.log('File created:', newFile);
    return newFile;
  }

  async findAllFiles(): Promise<GetFilesOutputDto[]> {
    const files = await this.fileRepository.findAll();
    return files.map(mapperFileToOutputDto);
  }

  async downloadFile(id: string): Promise<string> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new NotFoundException('File not found');

    await this.fileRepository.incrementViewCount(id);

    const fileKey = file.fileUrl.split('/').slice(-1)[0];

    return this.s3Service.generatePresignedUrl(fileKey);
  }

  async getStats(): Promise<StatsResponseDto> {
    const [totalUploads, categoryBreakdown, topFiles] = await Promise.all([
      this.fileRepository.count(),
      this.fileRepository.getCategoryBreakdown(),
      this.fileRepository.getTopFiles(),
    ]);

    return {
      totalUploads,
      categoryBreakdown,
      topFiles,
    };
  }
}
