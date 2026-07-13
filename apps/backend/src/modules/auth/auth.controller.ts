import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { DeviceGuard } from 'src/common/guards/device.guard';
import { VerifyPinDto } from './dto/verify-pin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard, DeviceGuard)
  logout(
    @GetUser() user: User,
  ) {
    return this.authService.logout(user);
  }

  @UseGuards(JwtAuthGuard, DeviceGuard)  
  @Get('profile')
  profile(@GetUser() user: any,) {
    return user;
  }

  @UseGuards(JwtAuthGuard, DeviceGuard)
  @Post('heartbeat')
  hearthbeat(@GetUser() user: User, @Headers('x-device-id') deviceId: string ){
    return this.authService.heartbeat(user, deviceId);
  }

  @UseGuards(JwtAuthGuard, DeviceGuard)
  @Post('verify-pin')
  verifyPin( @GetUser() user: User, @Body() dto: VerifyPinDto,) {
    return this.authService.verifyPin(user, dto);
  }

}