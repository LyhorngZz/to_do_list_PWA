import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Cron('*/1 * * * *')
  async cleanupInactiveSessions() {

    console.log("Running cleanup...");

    const timeout = new Date(
      Date.now() - 3 * 60 * 1000,
    );

    const result =
      await this.userRepository.update(
        {
          isLoggedIn: true,
          lastSeen: LessThan(timeout),
        },
        {
          isLoggedIn: false,
          currentDeviceId: null,
        },
      );

    console.log(result.affected);
  }

}