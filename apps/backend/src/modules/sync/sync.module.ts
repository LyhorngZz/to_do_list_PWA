import { Module } from "@nestjs/common";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "../todos/entities/todo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class syncModule{}