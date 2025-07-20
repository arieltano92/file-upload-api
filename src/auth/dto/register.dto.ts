import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ariel' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Martínez' })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ example: 'ariel@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 6 })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
