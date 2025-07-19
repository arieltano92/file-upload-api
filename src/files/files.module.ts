import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { S3Service } from 'src/aws/s3/s3.service';
import { FilesRepository } from './repositories/files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService, S3Service, FilesRepository],
})
export class FilesModule {}
