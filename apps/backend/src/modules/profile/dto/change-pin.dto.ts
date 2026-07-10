import { IsString, Matches } from 'class-validator';

export class ChangePinDto {
  @IsString()
  @Matches(/^\d{4,6}$/, {
    message: 'Old PIN must contain only 4 to 6 digits.',
  })
  oldPin: string;

  @IsString()
  @Matches(/^\d{4,6}$/, {
    message: 'New PIN must contain only 4 to 6 digits.',
  })
  newPin: string;
}