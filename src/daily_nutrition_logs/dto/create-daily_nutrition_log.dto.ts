import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDailyNutritionLogDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsNumber()
  @Min(0)
  calorie: number;

  @IsNumber()
  @Min(0)
  carbohydrate: number;

  @IsNumber()
  @Min(0)
  protein: number;

  @IsNumber()
  @Min(0)
  fat: number;

  @IsNumber()
  @Min(0)
  sodium: number;

  @IsDate()
  @IsOptional()
  log_date: Date;
}
