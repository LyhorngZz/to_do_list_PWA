import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";

export class TodoSyncDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  completed: boolean;

  @IsBoolean()
  deleted: boolean;

  @IsString()
  updatedAt: string;
}



export class TodoChangesDto {
  @ValidateNested({ each: true })
  @Type(() => TodoSyncDto)
  created: TodoSyncDto[];

  @ValidateNested({ each: true })
  @Type(() => TodoSyncDto)
  updated: TodoSyncDto[];

  @ValidateNested({ each: true })
  @Type(() => TodoSyncDto)
  deleted: TodoSyncDto[];
}

export class PushChangesDto {
  @ValidateNested()
  @Type(() => TodoChangesDto)
  todos: TodoChangesDto;
}


export class PushDto {
  @IsOptional()
  @IsString()
  lastPulledAt?: string;

  @ValidateNested()
  @Type(() => PushChangesDto)
  changes: PushChangesDto;
}