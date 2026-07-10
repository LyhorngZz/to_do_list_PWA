import { IsEmail, IsNotEmpty, IsUUID, isUUID } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsUUID()
  deviceId: string;
}