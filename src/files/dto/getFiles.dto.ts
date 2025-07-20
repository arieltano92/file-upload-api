import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../enums/category.enum';
import { Language } from '../enums/language.enum';
import { Provider } from '../enums/provider.enum';
import { Role } from '../enums/role.enum';

class UserSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;
}

export class GetFilesOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: Category })
  category: Category;

  @ApiProperty({ enum: Language })
  language: Language;

  @ApiProperty({ enum: Provider })
  provider: Provider;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;
}
