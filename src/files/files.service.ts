import { Injectable } from '@nestjs/common';
import { FilesRepository } from './repositories/files.repository';
import { S3Service } from 'src/aws/s3/s3.service';
import { CreateFileDto } from './dto/createFile.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileRepository: FilesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(data: CreateFileDto, file: Express.Multer.File) {
    const fileUrl = await this.s3Service.uploadFile(file);

    // const newFile = this.filesRepo.create({
    //   ...data,
    //   fileUrl,
    // });

    //return await this.filesRepo.save(newFile);
  }
}
