import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FilesRepository } from './repositories/files.repository';
import { S3Service } from '../aws/s3/s3.service';
import { CreateFileDto } from './dto/createFile.dto';
import { Category } from './enums/category.enum';
import { Language } from './enums/language.enum';
import { Provider } from './enums/provider.enum';
import { Role } from './enums/role.enum';

describe('FilesService', () => {
  let service: FilesService;
  let fileRepository: Partial<FilesRepository>;
  let s3Service: Partial<S3Service>;

  beforeEach(async () => {
    fileRepository = {
      createFile: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    };

    s3Service = {
      uploadFile: jest.fn().mockResolvedValue('https://s3-url.com/file.pdf'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: FilesRepository, useValue: fileRepository },
        { provide: S3Service, useValue: s3Service },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should upload file and create DB entry', async () => {
    const dto: CreateFileDto = {
      title: 'Test file',
      description: 'description',
      category: Category.CONFLICT_RESOLUTION,
      language: Language.EN,
      provider: Provider.INTERNAL,
      role: Role.MENTEE,
    };

    const mockFile = {
      originalname: 'test.pdf',
      buffer: Buffer.from('fake-content'),
    } as Express.Multer.File;

    const result = await service.create(dto, mockFile, 'user-id-123');

    expect(s3Service.uploadFile).toHaveBeenCalledWith(mockFile);
    expect(fileRepository.createFile).toHaveBeenCalledWith(
      expect.objectContaining({
        title: dto.title,
        fileUrl: 'https://s3-url.com/file.pdf',
      }),
    );
    expect(result).toEqual({ id: 'mock-id' });
  });
});
