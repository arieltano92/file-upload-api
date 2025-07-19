import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreateFileDto } from './dto/createFile.dto';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Upload directly to S3
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB —adjust base on your needs
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileDto,
  ) {
    return this.filesService.create(body, file);
  }
}
