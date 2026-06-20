import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { type AuthUser } from '../common/current-user.decoraor';
import { PrismaService } from '../prisma/prisma.service';
import {
  checkPermission,
  checkPermissionRole,
} from '../common/checkPermission';
import { percentNutrition } from '../common/intake-nutrients';
@Injectable()
export class DailyNutritionLogsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: QueryDto, userRole: string) {
    checkPermissionRole(userRole);
    const { page, limit } = query;
    const [dailyNutritionLogs, total] = await Promise.all([
      this.prisma.daily_nutrition_logs.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.daily_nutrition_logs.count(),
    ]);

    // 퍼센트 계산
    // profile에서 goal 가져오기
    const goals = await this.prisma.profile.findMany({
      where: {
        userId: { in: dailyNutritionLogs.map((logs) => logs.userId) },
      },
    });

    const percents: {
      userId: number;
      perCalorie: string;
      perCarbohydrate: string;
      perProtein: string;
      perFat: string;
      perSodium: string;
      eaten_date: Date;
    }[] = [];

    dailyNutritionLogs.map((dnl) => {
      const goal = goals.find((g) => g.userId === dnl.userId);
      if (goal) {
        const { perCalorie, perCarbohydrate, perProtein, perFat, perSodium } =
          percentNutrition(
            {
              calorie: dnl.calorie.toNumber(),
              carbohydrate: dnl.carbohydrate.toNumber(),
              protein: dnl.protein.toNumber(),
              fat: dnl.fat.toNumber(),
              sodium: dnl.sodium.toNumber(),
            },
            {
              calorie_goal: goal.calorie_goal,
              carbohydrate_goal: goal.carbohydrate_goal,
              protein_goal: goal.protein_goal,
              fat_goal: goal.fat_goal,
              sodium_goal: goal.sodium_goal,
            },
          );
        percents.push({
          userId: dnl.userId,
          perCalorie,
          perCarbohydrate,
          perProtein,
          perFat,
          perSodium,
          eaten_date: dnl.log_date,
        });
      }
    });

    return {
      percents,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, user: AuthUser) {
    const exists = await this.prisma.daily_nutrition_logs.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`해당 ${id}의 사용자 영양 기록이 없어요`);
    }

    checkPermission(user.role, user.id, exists.userId);
    // 퍼센트 계산

    // profile에서 goal 가져오기
    const profile = await this.prisma.profile.findUnique({
      where: { userId: exists.userId },
    });

    if (!profile)
      throw new NotFoundException(
        `${user.id}의 목표가 없어요 프로필에서 작성해주세요`,
      );
    return percentNutrition(
      {
        calorie: exists.calorie.toNumber(),
        carbohydrate: exists.carbohydrate.toNumber(),
        protein: exists.protein.toNumber(),
        fat: exists.fat.toNumber(),
        sodium: exists.sodium.toNumber(),
      },
      {
        calorie_goal: profile.calorie_goal,
        carbohydrate_goal: profile.carbohydrate_goal,
        protein_goal: profile.protein_goal,
        fat_goal: profile.fat_goal,
        sodium_goal: profile.sodium_goal,
      },
    );
  }
}
