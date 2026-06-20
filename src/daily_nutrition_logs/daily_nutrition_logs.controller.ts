import { Controller, Get, Param } from '@nestjs/common';
import { DailyNutritionLogsService } from './daily_nutrition_logs.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('daily-nutrition-logs')
@ApiTags('Daily Nutrition logs')
export class DailyNutritionLogsController {
  constructor(
    private readonly dailyNutritionLogsService: DailyNutritionLogsService,
  ) {}

  @Get()
  findAll() {
    return this.dailyNutritionLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyNutritionLogsService.findOne(+id);
  }
}
