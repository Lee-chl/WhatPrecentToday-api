import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyNutritionLogDto } from './create-daily_nutrition_log.dto';

export class UpdateDailyNutritionLogDto extends PartialType(
  CreateDailyNutritionLogDto,
) {}
