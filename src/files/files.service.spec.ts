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

  it('should return all files with user data', async () => {
    const mockFiles = [
      {
        id: 'file-1',
        title: 'File 1',
        description: 'Desc',
        category: Category.CONFLICT_RESOLUTION,
        language: Language.EN,
        provider: Provider.INTERNAL,
        role: Role.MENTEE,
        fileUrl: 'https://s3-url.com/file1.pdf',
        viewCount: 5,
        createdAt: new Date('2025-07-19T00:00:00Z'),
        user: {
          id: 'user-1',
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
        },
      },
    ];

    fileRepository.findAll = jest.fn().mockResolvedValue(mockFiles);

    const result = await service.findAllFiles();

    expect(fileRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: 'file-1',
        title: 'File 1',
        description: 'Desc',
        category: Category.CONFLICT_RESOLUTION,
        language: Language.EN,
        provider: Provider.INTERNAL,
        role: Role.MENTEE,
        fileUrl: 'https://s3-url.com/file1.pdf',
        viewCount: 5,
        createdAt: new Date('2025-07-19T00:00:00Z'),
        user: {
          id: 'user-1',
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
        },
      },
    ]);
  });

  it('should return stats with total uploads, category breakdown, and top files', async () => {
    fileRepository.count = jest.fn().mockResolvedValue(10);

    fileRepository.getCategoryBreakdown = jest.fn().mockResolvedValue({
      TRAINING: 6,
      CONFLICT_RESOLUTION: 4,
    });

    fileRepository.getTopFiles = jest.fn().mockResolvedValue([
      { id: 'f1', title: 'File 1', viewCount: 20 },
      { id: 'f2', title: 'File 2', viewCount: 15 },
    ]);

    const result = await service.getStats();

    expect(fileRepository.count).toHaveBeenCalled();
    expect(fileRepository.getCategoryBreakdown).toHaveBeenCalled();
    expect(fileRepository.getTopFiles).toHaveBeenCalled();

    expect(result).toEqual({
      totalUploads: 10,
      categoryBreakdown: {
        TRAINING: 6,
        CONFLICT_RESOLUTION: 4,
      },
      topFiles: [
        { id: 'f1', title: 'File 1', viewCount: 20 },
        { id: 'f2', title: 'File 2', viewCount: 15 },
      ],
    });
  });
});
