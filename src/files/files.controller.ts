import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreateFileDto } from './dto/createFilesOutput.dto';
import { ApiConsumes, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { GetFilesOutputDto } from './dto/getFiles.dto';
import { Response } from 'express';

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

  @Get()
  @ApiOkResponse({ type: [GetFilesOutputDto] })
  async getFiles(): Promise<GetFilesOutputDto[]> {
    const files = await this.filesService.findAllFiles();
    return files;
  }

  @Get(':id/download')
  @HttpCode(302)
  @ApiParam({ name: 'id', description: 'File ID' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const url = await this.filesService.downloadFile(id);
    return res.redirect(url);
  }
}
