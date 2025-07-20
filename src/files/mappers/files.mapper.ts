import { GetFilesOutputDto } from '../dto/getFiles.dto';
import { File } from '../entities/file.entity';

export const mapperFileToOutputDto = (file: File): GetFilesOutputDto => ({
  id: file.id,
  title: file.title,
  description: file.description,
  fileUrl: file.fileUrl,
  viewCount: file.viewCount,
  createdAt: file.createdAt,
  category: file.category,
  language: file.language,
  provider: file.provider,
  role: file.role,
  user: {
    id: file.user?.id || '',
    name: file.user?.name || '',
    surname: file.user?.surname || '',
    email: file.user?.email || '',
  },
});
