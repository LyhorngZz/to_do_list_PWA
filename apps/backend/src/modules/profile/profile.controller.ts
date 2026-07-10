import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { GetUser } from "src/common/decorators/get-user.decorator";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { DeviceGuard } from "src/common/guards/device.guard";
import { UpdatePinDto } from "./dto/update-pin.dto";
import { ChangePinDto } from "./dto/change-pin.dto";
import { use } from "passport";


@Controller('profile')
@UseGuards(JwtAuthGuard, DeviceGuard)
export class ProfileController{

  constructor(
    private readonly profileService: ProfileService,
  ){}

  @Get()
  getProfile(@GetUser() user: User){
    return this.profileService.getProfile(user);
  }

  @Patch('pin')
  updatePin(@GetUser() user: User, @Body() dto: UpdatePinDto){
    return this.profileService.updatePin(user, dto);
  }

  @Patch('change-pin')
  changePin(@GetUser() user: User, @Body() dto: ChangePinDto){
    return this.profileService.changePin(user, dto);
  }

}