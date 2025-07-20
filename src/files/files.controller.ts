import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreateFileDto } from './dto/createFilesOutput.dto';
import { ApiConsumes, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { GetFilesOutputDto } from './dto/getFiles.dto';
import { Response } from 'express';
import { StatsResponseDto } from './dto/statsOutput.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
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
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() fileMetadata: CreateFileDto,
  ) {
    return this.filesService.create(fileMetadata, file, user.userId);
  }

  @Get()
  @ApiOkResponse({ type: [GetFilesOutputDto] })
  async getFiles(): Promise<GetFilesOutputDto[]> {
    const files = await this.filesService.findAllFiles();
    return files;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  @HttpCode(302)
  @ApiParam({ name: 'id', description: 'File ID' })
  async download(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const url = await this.filesService.downloadFile(id);
    return res.redirect(url);
  }

  @Get('/stats')
  @ApiOkResponse({
    description: 'Aggregated statistics about uploaded files',
    type: StatsResponseDto,
  })
  async getStats(): Promise<StatsResponseDto> {
    return this.filesService.getStats();
  }
}
