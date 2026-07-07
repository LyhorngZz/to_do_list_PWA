import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser =
      await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }


  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };

    return {
      access_token: await this.jwtService.signAsync(
        payload,
      ),
    };
  }

}