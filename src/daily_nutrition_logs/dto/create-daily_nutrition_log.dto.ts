import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDailyNutritionLogDto {
  constructor(data: CreateDailyNutritionLogDto) {
    this.userId = data.userId;
    this.calorie = data.calorie;
    this.carbohydrate = data.carbohydrate;
    this.protein = data.protein;
    this.fat = data.fat;
    this.sodium = data.sodium;
    this.log_date = data.log_date;
  }
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
