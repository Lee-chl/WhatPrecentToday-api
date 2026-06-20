import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { type AuthUser } from '../common/current-user.decoraor';
import { PrismaService } from '../prisma/prisma.service';
import {
  checkPermission,
  checkPermissionRole,
} from '../common/checkPermission';
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
    return {
      dailyNutritionLogs,
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
    return exists;
  }
}
