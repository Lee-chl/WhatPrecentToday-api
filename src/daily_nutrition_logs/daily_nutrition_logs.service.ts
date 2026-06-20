import { Injectable } from '@nestjs/common';
import { UpdateDailyNutritionLogDto } from './dto/update-daily_nutrition_log.dto';

@Injectable()
export class DailyNutritionLogsService {
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
