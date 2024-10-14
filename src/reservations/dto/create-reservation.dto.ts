import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  bikeId: number;

  @IsNotEmpty()
  userId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
