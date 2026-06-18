import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyNutritionLogsService } from './daily_nutrition_logs.service';
import { CreateDailyNutritionLogDto } from './dto/create-daily_nutrition_log.dto';
import { UpdateDailyNutritionLogDto } from './dto/update-daily_nutrition_log.dto';

@Controller('daily-nutrition-logs')
export class DailyNutritionLogsController {
  constructor(private readonly dailyNutritionLogsService: DailyNutritionLogsService) {}

  @Post()
  create(@Body() createDailyNutritionLogDto: CreateDailyNutritionLogDto) {
    return this.dailyNutritionLogsService.create(createDailyNutritionLogDto);
  }

  @Get()
  findAll() {
    return this.dailyNutritionLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyNutritionLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyNutritionLogDto: UpdateDailyNutritionLogDto) {
    return this.dailyNutritionLogsService.update(+id, updateDailyNutritionLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyNutritionLogsService.remove(+id);
  }
}
