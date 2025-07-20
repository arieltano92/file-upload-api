import { IsString, IsEnum, MaxLength } from 'class-validator';
import { Category } from '../enums/category.enum';
import { Language } from '../enums/language.enum';
import { Provider } from '../enums/provider.enum';
import { Role } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    maxLength: 200,
    example: 'How to deal with conflict in a work environment',
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    maxLength: 1000,
    example:
      'Step by step guide to resolve conflict caused by miscommunication',
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ enum: Category, example: Category.CONFLICT_RESOLUTION })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ enum: Language, example: Language.EN })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ enum: Provider, example: Provider.INTERNAL })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ enum: Role, example: Role.MENTOR })
  @IsEnum(Role)
  role: Role;
}
