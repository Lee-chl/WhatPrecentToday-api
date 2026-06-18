import { Injectable } from '@nestjs/common';
import { CreateDailyNutritionLogDto } from './dto/create-daily_nutrition_log.dto';
import { UpdateDailyNutritionLogDto } from './dto/update-daily_nutrition_log.dto';

@Injectable()
export class DailyNutritionLogsService {
  create(createDailyNutritionLogDto: CreateDailyNutritionLogDto) {
    return 'This action adds a new dailyNutritionLog';
  }

  findAll() {
    return `This action returns all dailyNutritionLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyNutritionLog`;
  }

  update(id: number, updateDailyNutritionLogDto: UpdateDailyNutritionLogDto) {
    return `This action updates a #${id} dailyNutritionLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyNutritionLog`;
  }
}
