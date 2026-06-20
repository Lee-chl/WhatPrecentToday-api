import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIntakeLogDto } from './dto/create-intake_log.dto';
import { UpdateIntakeLogDto } from './dto/update-intake_log.dto';
import { type AuthUser, CurrentUser } from '../common/current-user.decoraor';
import { checkPermission } from '../common/checkPermission';
import { PrismaService } from '../prisma/prisma.service';
import { intakeNutrients } from '../common/intake-nutrients';
import { QueryDto } from '../common/query.dto';

@Injectable()
export class IntakeLogsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createIntakeLogDto: CreateIntakeLogDto,
    @CurrentUser() user: AuthUser,
  ) {
    checkPermission(user.role, user.id, createIntakeLogDto.userId);
    // 유저확인
    const userExist = await this.prisma.users.findUnique({
      where: { id: createIntakeLogDto.userId },
    });
    if (!userExist)
      throw new NotFoundException(
        `유저 : ${createIntakeLogDto.userId}가 없어요`,
      );
    // 음식 확인
    const foodExist = await this.prisma.foods.findUnique({
      where: {
        id: createIntakeLogDto.foodId,
      },
    });
    if (!foodExist)
      throw new NotFoundException(
        `식품: ${createIntakeLogDto.foodId}가 없어요`,
      );
    // createIntakeLogDto 계산 하기 전 섭취량 확인!
    if (!createIntakeLogDto.intake) {
      createIntakeLogDto.intake =
        foodExist.NUTRI_AMOUNT_SERVING?.toNumber() ??
        foodExist.total_capacity?.toNumber();
      // 한번 더 체크
      if (!createIntakeLogDto.intake) {
        throw new NotFoundException(`섭취량이 없어요`);
      }
    }
    // 날짜가 있을 경우 음식 섭취한 기록이 있는지 (같은 유저,음식,날짜로)
    if (createIntakeLogDto.eaten_at) {
      const existsIntake = await this.prisma.intake_logs.findFirst({
        where: {
          userId: createIntakeLogDto.userId,
          foodId: createIntakeLogDto.foodId,
          eaten_at: createIntakeLogDto.eaten_at,
        },
      });
      if (existsIntake)
        throw new ConflictException(`이미 해당하는 기록이 있어요`);
    }

    // 계산
    const nutrients = {
      intake: createIntakeLogDto.intake,
      calorie: foodExist.calorie.toNumber(),
      carbohydrate: foodExist.carbohydrate.toNumber(),
      protein: foodExist.protein.toNumber(),
      fat: foodExist.fat.toNumber(),
      sodium: foodExist.sodium.toNumber(),
      servingSize: foodExist.SERVING_SIZE.toNumber(),
    };

    const { calorie, carbohydrate, protein, fat, sodium } =
      intakeNutrients(nutrients);

    createIntakeLogDto.calorie = Math.max(0, calorie);
    createIntakeLogDto.carbohydrate = Math.max(0, carbohydrate);
    createIntakeLogDto.protein = Math.max(0, protein);
    createIntakeLogDto.fat = Math.max(0, fat);
    createIntakeLogDto.sodium = Math.max(0, sodium);

    return this.prisma.intake_logs.create({
      data: createIntakeLogDto,
    });
  }

  async findAll(query: QueryDto) {
    const { page, limit } = query;
    const [intakes, total] = await Promise.all([
      this.prisma.intake_logs.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.intake_logs.count(),
    ]);
    return { intakes, total, page, limit, totalPage: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    // 확인
    const exists = await this.prisma.intake_logs.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`${id}가 존재하지 않아요`);
    return exists;
  }

  async update(
    id: number,
    updateIntakeLogDto: UpdateIntakeLogDto,
    user: AuthUser,
  ) {
    const exists = await this.findOne(id);
    checkPermission(user.role, user.id, exists.userId);
    const foodExists = await this.prisma.foods.findUnique({
      where: { id: exists.foodId },
    });

    // 계산 하기 전에 값 인입해주기
    if (!updateIntakeLogDto.intake) {
      updateIntakeLogDto.intake =
        foodExists!.NUTRI_AMOUNT_SERVING?.toNumber() ||
        foodExists!.total_capacity?.toNumber();
      // 한번 더 체크
      if (!updateIntakeLogDto.intake) {
        throw new NotFoundException(`섭취량이 없어요`);
      }
    }

    // 계산 하기 (수정은 같은 음식에서 양만 달라질 수 있다.)
    const nutrients = {
      intake: updateIntakeLogDto.intake,
      calorie: foodExists!.calorie.toNumber(),
      carbohydrate: foodExists!.carbohydrate.toNumber(),
      protein: foodExists!.protein.toNumber(),
      fat: foodExists!.fat.toNumber(),
      sodium: foodExists!.sodium.toNumber(),
      servingSize: foodExists!.SERVING_SIZE.toNumber(),
    };

    const { calorie, carbohydrate, protein, fat, sodium } =
      intakeNutrients(nutrients);

    updateIntakeLogDto.calorie = Math.max(0, calorie);
    updateIntakeLogDto.carbohydrate = Math.max(0, carbohydrate);
    updateIntakeLogDto.protein = Math.max(0, protein);
    updateIntakeLogDto.fat = Math.max(0, fat);
    updateIntakeLogDto.sodium = Math.max(0, sodium);
    return this.prisma.intake_logs.update({
      where: { id },
      data: {
        ...updateIntakeLogDto,
        userId: exists.userId,
        foodId: exists.foodId,
      },
    });
  }

  async remove(id: number, user: AuthUser) {
    const exist = await this.findOne(id);
    checkPermission(user.role, exist.userId, user.id);
    await this.prisma.intake_logs.delete({
      where: { id },
    });
    return { deleted: id };
  }
}
