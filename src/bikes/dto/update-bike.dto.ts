import { IsString, IsDecimal, IsOptional } from 'class-validator';

export class UpdateBikeDto {
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDecimal()
  avgRating?: number;
}
