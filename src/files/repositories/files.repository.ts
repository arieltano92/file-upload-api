import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesRepository extends Repository<File> {
  constructor(private dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }

  async findWithFilters(): Promise<File[]> {
    return this.find({ order: { createdAt: 'DESC' } });
  }
}
