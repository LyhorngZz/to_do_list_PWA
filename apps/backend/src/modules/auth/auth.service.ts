import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { VerifyPinDto } from './dto/verify-pin.dto';

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

    if(user.isLoggedIn && user.currentDeviceId !== loginDto.deviceId) {
      throw new UnauthorizedException(
        'This account is already logged in on another device.'
      )
    }

    user.isLoggedIn = true;
    user.currentDeviceId = loginDto.deviceId;
    user.lastSeen = new Date();

    await this.usersService.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };

    return {
      access_token: await this.jwtService.signAsync(
        payload,
      ),
      hasPin: user.pin !== null,
    };
  }

  async heartbeat(
    user: User,
    deviceId: string,
  ) {

    if (
      user.currentDeviceId !== deviceId
    ) {
      throw new UnauthorizedException(
        'Invalid device.',
      );
    }

    user.lastSeen = new Date();

    await this.usersService.save(user);
    return {
      success: true,
    };
  }


  async verifyPin(
    user: User,
    dto: VerifyPinDto,
  ) {
    if (!user.pin) {
      throw new BadRequestException(
        'PIN has not been set.',
      );
    }

    const isMatch = await bcrypt.compare(
      dto.pin,
      user.pin,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid PIN.',
      );
    }

    return {
      message: 'PIN verified successfully.',
    };
  }


}