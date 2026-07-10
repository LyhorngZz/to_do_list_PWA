import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodosModule } from './modules/todos/todos.module';
import { syncModule } from './modules/sync/sync.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { SessionService } from './modules/session/session.service';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',

      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,

      synchronize: true,
    }),
    UsersModule, AuthModule, TodosModule, syncModule, ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, SessionService],
})
export class AppModule {}
