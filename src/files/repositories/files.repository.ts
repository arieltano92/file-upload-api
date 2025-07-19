import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesRepository extends Repository<File> {
  constructor(private dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }

  async createFile(fileData: Partial<File>): Promise<File> {
    const file = this.create(fileData);
    return this.save(file);
  }

  async findAll(): Promise<File[]> {
    return this.find({ order: { createdAt: 'DESC' } });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.increment({ id }, 'viewCount', 1);
  }
}
