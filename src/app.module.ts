import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FoodsModule } from './foods/foods.module';
import { ProfileModule } from './profile/profile.module';
import { IntakeLogsModule } from './intake_logs/intake_logs.module';
import { DailyNutritionLogsModule } from './daily_nutrition_logs/daily_nutrition_logs.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, FoodsModule, ProfileModule, IntakeLogsModule, DailyNutritionLogsModule, CategoriesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
