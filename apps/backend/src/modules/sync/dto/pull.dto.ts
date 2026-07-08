import { IsISO8601, IsOptional } from 'class-validator';

export class PullDto {
  @IsOptional()
  @IsISO8601()
  lastPulledAt?: string;
}