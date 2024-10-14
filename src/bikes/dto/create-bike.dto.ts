import { IsString, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateBikeDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDecimal()
  @IsNotEmpty()
  avgRating: number;
}
