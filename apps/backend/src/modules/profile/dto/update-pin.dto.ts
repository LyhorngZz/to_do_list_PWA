import { IsString, Matches } from 'class-validator';

export class UpdatePinDto {
  @IsString()
  @Matches(/^\d{4,6}$/, {
    message: 'PIN must contain only 4 to 6 digits.',
  })
  pin: string;
}