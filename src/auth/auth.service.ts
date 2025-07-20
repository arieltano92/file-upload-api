import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    console.log(registerDto);
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    console.log('Existing User:', existingUser);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      userId: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
