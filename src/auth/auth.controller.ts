import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterOutputDto } from './dto/register.dto';
import { LoginDto, LoginOutputDto } from './dto/login.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'Register a new User',
    type: RegisterOutputDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterOutputDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Login and obtain JWT token',
    type: LoginOutputDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<{
    access_token: string;
  }> {
    return this.authService.login(loginDto);
  }
}
