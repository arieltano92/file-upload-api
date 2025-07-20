import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ariel' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Martínez' })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ example: 'ariel@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 6 })
  @MinLength(6)
  password: string;
}
