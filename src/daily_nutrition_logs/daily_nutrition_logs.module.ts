import { Module } from '@nestjs/common';
import { DailyNutritionLogsService } from './daily_nutrition_logs.service';
import { DailyNutritionLogsController } from './daily_nutrition_logs.controller';

@Module({
  controllers: [DailyNutritionLogsController],
  providers: [DailyNutritionLogsService],
})
export class DailyNutritionLogsModule {}
