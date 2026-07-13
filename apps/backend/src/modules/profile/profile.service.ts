import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { UpdatePinDto } from "./dto/update-pin.dto";
import * as bcrypt from 'bcrypt'
import { ChangePinDto } from "./dto/change-pin.dto";

@Injectable()
export class ProfileService{
  constructor(
    private readonly usersService: UsersService,
  ){}

  async getProfile(user: User){
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // create PIN
  async updatePin(
    user: User,
    dto: UpdatePinDto,
  ) {

    const hashedPin = await bcrypt.hash(
      dto.pin,
      10,
    );

    user.pin = hashedPin;

    await this.usersService.save(user);

    return {
      message: 'PIN updated successfully.',
    };
  }

  async changePin(
    user: User,
    dto: ChangePinDto,
  ) {

    if (!user.pin) {
      throw new BadRequestException(
        'PIN has not been set.',
      );
    }

    const isMatch = await bcrypt.compare(
      dto.oldPin,
      user.pin,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Old PIN is incorrect.',
      );
    }

    const hashedPin = await bcrypt.hash(
      dto.newPin,
      10,
    );

    user.pin = hashedPin;

    await this.usersService.save(user);

    return {
      message: 'PIN changed successfully.',
    };
  }


}