import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { File } from '../entities/file.entity';
import { TopFileDto } from '../dto/statsOutput.dto';

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
    return this.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.increment({ id }, 'viewCount', 1);
  }

  async getCategoryBreakdown(): Promise<Record<string, number>> {
    const rows = await this.createQueryBuilder('file')
      .select('file.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('file.category')
      .getRawMany();

    return rows.reduce(
      (acc, row) => {
        acc[row.category] = parseInt(row.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getTopFiles(limit = 5): Promise<TopFileDto[]> {
    return this.createQueryBuilder('file')
      .select(['file.id', 'file.title', 'file.viewCount'])
      .orderBy('file.viewCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
