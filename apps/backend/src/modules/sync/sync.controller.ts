import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PullDto } from "./dto/pull.dto";
import { User } from "../users/entities/user.entity";
import { GetUser } from "src/common/decorators/get-user.decorator";
import { PushDto } from "./dto/push.dto";
import { SyncService } from "./sync.service";

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
  ) {}

  @Get('pull')
  pull(
    @Query() dto: PullDto,
    @GetUser() user: User,
  ) {
    return this.syncService.pull(dto, user);
  }

  @Post('push')
  push(
    @Body() dto: PushDto,
    @GetUser() user: User,
  ) {
    return this.syncService.push(dto, user);
  }
}