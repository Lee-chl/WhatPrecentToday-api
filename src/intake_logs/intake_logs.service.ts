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
import {
  calculateNutrition,
  intakeNutrients,
} from '../common/intake-nutrients';
import { QueryDto } from '../common/query.dto';
import { CreateDailyNutritionLogDto } from '../daily_nutrition_logs/dto/create-daily_nutrition_log.dto';
import { UpdateDailyNutritionLogDto } from '../daily_nutrition_logs/dto/update-daily_nutrition_log.dto';

@Injectable()
export class IntakeLogsService {
  constructor(private readonly prisma: PrismaService) {}
  async saveIntakeAndDailyNutrition(
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

    // ts: 내부 프리지마여서 일관성 보장 (내부에서만 사용 가능/ 롤백 가능)
    return this.prisma.$transaction(async (tx) => {
      // 계산
      const nutrient = {
        calorie: foodExist.calorie.toNumber(),
        carbohydrate: foodExist.carbohydrate.toNumber(),
        protein: foodExist.protein.toNumber(),
        fat: foodExist.fat.toNumber(),
        sodium: foodExist.sodium.toNumber(),
      };
      const intake = createIntakeLogDto.intake;
      const servingSize: number = foodExist.SERVING_SIZE.toNumber();

      const { calorie, carbohydrate, protein, fat, sodium } = intakeNutrients({
        intake,
        nutrients: nutrient,
        servingSize,
      });

      createIntakeLogDto.calorie = Math.max(0, calorie);
      createIntakeLogDto.carbohydrate = Math.max(0, carbohydrate);
      createIntakeLogDto.protein = Math.max(0, protein);
      createIntakeLogDto.fat = Math.max(0, fat);
      createIntakeLogDto.sodium = Math.max(0, sodium);

      const intakeLog = await tx.intake_logs.create({
        data: createIntakeLogDto,
      });

      // daily nutrition log create
      // 우선 이미 데일리 영양소 데이터가 있는 지 확인 후 가져오기
      // (unique 값 eaten_date 랑 userId 가져와서 확인)
      const dailyNutritionExist = await tx.daily_nutrition_logs.findUnique({
        where: {
          userId_log_date: {
            userId: intakeLog.userId,
            log_date: intakeLog.eaten_at,
          },
        },
      });
      // dto 에 계산할 값들 넣기
      const newDailyNutritionDTO = new CreateDailyNutritionLogDto({
        userId: intakeLog.userId,
        calorie: intakeLog.calorie.toNumber(),
        carbohydrate: intakeLog.carbohydrate.toNumber(),
        protein: intakeLog.protein.toNumber(),
        fat: intakeLog.fat.toNumber(),
        sodium: intakeLog.sodium.toNumber(),
        log_date: intakeLog.eaten_at,
      });

      // 그 전 값이 있으면 현재 음식 값이랑 더해주기
      if (dailyNutritionExist) {
        newDailyNutritionDTO.calorie += dailyNutritionExist.calorie.toNumber();
        newDailyNutritionDTO.carbohydrate +=
          dailyNutritionExist.carbohydrate.toNumber();
        newDailyNutritionDTO.protein += dailyNutritionExist.protein.toNumber();
        newDailyNutritionDTO.fat += dailyNutritionExist.fat.toNumber();
        newDailyNutritionDTO.sodium += dailyNutritionExist.sodium.toNumber();
      }

      // profile에서 goal 가져오기
      const profile = await tx.profile.findUnique({
        where: { userId: newDailyNutritionDTO.userId },
      });
      if (!profile)
        throw new NotFoundException(
          `${newDailyNutritionDTO.userId}의 목표가 없어요
          프로필에서 작성해주세요`,
        );
      const {
        calorieRatio,
        carbohydrateRatio,
        proteinRatio,
        fatRatio,
        sodiumRatio,
      } = calculateNutrition(
        {
          calorie: newDailyNutritionDTO.calorie,
          carbohydrate: newDailyNutritionDTO.carbohydrate,
          protein: newDailyNutritionDTO.protein,
          fat: newDailyNutritionDTO.fat,
          sodium: newDailyNutritionDTO.sodium,
        },
        {
          calorie_goal: profile.calorie_goal,
          carbohydrate_goal: profile.carbohydrate_goal,
          protein_goal: profile.protein_goal,
          fat_goal: profile.fat_goal,
          sodium_goal: profile.sodium_goal,
        },
      );

      // db에 저장 있으면 update 없으면 insert
      await tx.daily_nutrition_logs.upsert({
        where: {
          userId_log_date: {
            userId: newDailyNutritionDTO.userId,
            log_date: new Date(newDailyNutritionDTO.log_date),
          },
        },
        update: {
          calorie: calorieRatio,
          carbohydrate: carbohydrateRatio,
          protein: proteinRatio,
          fat: fatRatio,
          sodium: sodiumRatio,
        },
        create: {
          userId: newDailyNutritionDTO.userId,
          calorie: calorieRatio,
          carbohydrate: carbohydrateRatio,
          protein: proteinRatio,
          fat: fatRatio,
          sodium: sodiumRatio,
          log_date: new Date(newDailyNutritionDTO.log_date),
        },
      });

      return intakeLog;
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
    return this.prisma.$transaction(async (tx) => {
      const foodExists = await tx.foods.findUnique({
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
      const nutrient = {
        calorie: foodExists!.calorie.toNumber(),
        carbohydrate: foodExists!.carbohydrate.toNumber(),
        protein: foodExists!.protein.toNumber(),
        fat: foodExists!.fat.toNumber(),
        sodium: foodExists!.sodium.toNumber(),
      };
      const servingSize: number = foodExists!.SERVING_SIZE.toNumber();
      const intake = updateIntakeLogDto.intake;
      const { calorie, carbohydrate, protein, fat, sodium } = intakeNutrients({
        intake,
        nutrients: nutrient,
        servingSize,
      });

      updateIntakeLogDto.calorie = Math.max(0, calorie);
      updateIntakeLogDto.carbohydrate = Math.max(0, carbohydrate);
      updateIntakeLogDto.protein = Math.max(0, protein);
      updateIntakeLogDto.fat = Math.max(0, fat);
      updateIntakeLogDto.sodium = Math.max(0, sodium);
      const intakeLog = await tx.intake_logs.update({
        where: { id },
        data: {
          ...updateIntakeLogDto,
          userId: exists.userId,
          foodId: exists.foodId,
        },
      });
      // daily nutrition log update
      // 우선 데일리 영양소 데이터 가져오기
      // (unique 값 eaten_date 랑 userId 가져와서 확인)
      const dailyNutritionExist = await tx.daily_nutrition_logs.findUnique({
        where: {
          userId_log_date: {
            userId: intakeLog.userId,
            log_date: intakeLog.eaten_at,
          },
        },
      });

      // dto 에 계산할 값들 넣기
      const updateDailyNutritionDTO = new UpdateDailyNutritionLogDto();
      updateDailyNutritionDTO.userId = intakeLog.userId;
      updateDailyNutritionDTO.log_date = intakeLog.eaten_at;
      updateDailyNutritionDTO.calorie = intakeLog.calorie.toNumber();
      updateDailyNutritionDTO.carbohydrate = intakeLog.carbohydrate.toNumber();
      updateDailyNutritionDTO.protein = intakeLog.protein.toNumber();
      updateDailyNutritionDTO.fat = intakeLog.fat.toNumber();
      updateDailyNutritionDTO.sodium = intakeLog.sodium.toNumber();

      // 그 전 값이 있으면 현재 음식 값이랑 더해주기
      if (dailyNutritionExist) {
        updateDailyNutritionDTO.calorie +=
          dailyNutritionExist.calorie.toNumber();
        updateDailyNutritionDTO.carbohydrate +=
          dailyNutritionExist.carbohydrate.toNumber();
        updateDailyNutritionDTO.protein +=
          dailyNutritionExist.protein.toNumber();
        updateDailyNutritionDTO.fat += dailyNutritionExist.fat.toNumber();
        updateDailyNutritionDTO.sodium += dailyNutritionExist.sodium.toNumber();
      }

      // profile에서 goal 가져오기
      const profile = await tx.profile.findUnique({
        where: { userId: updateDailyNutritionDTO.userId },
      });
      if (!profile)
        throw new NotFoundException(
          `${updateDailyNutritionDTO.userId}의 목표가 없어요
          프로필에서 작성해주세요`,
        );

      const {
        calorieRatio,
        carbohydrateRatio,
        proteinRatio,
        fatRatio,
        sodiumRatio,
      } = calculateNutrition(
        {
          calorie: updateDailyNutritionDTO.calorie,
          carbohydrate: updateDailyNutritionDTO.carbohydrate,
          protein: updateDailyNutritionDTO.protein,
          fat: updateDailyNutritionDTO.fat,
          sodium: updateDailyNutritionDTO.sodium,
        },
        {
          calorie_goal: profile.calorie_goal,
          carbohydrate_goal: profile.carbohydrate_goal,
          protein_goal: profile.protein_goal,
          fat_goal: profile.fat_goal,
          sodium_goal: profile.sodium_goal,
        },
      );

      // db에 저장 있으면 update 없으면 insert
      await tx.daily_nutrition_logs.upsert({
        where: {
          userId_log_date: {
            userId: updateDailyNutritionDTO.userId,
            log_date: new Date(updateDailyNutritionDTO.log_date),
          },
        },
        update: {
          calorie: calorieRatio,
          carbohydrate: carbohydrateRatio,
          protein: proteinRatio,
          fat: fatRatio,
          sodium: sodiumRatio,
        },
        create: {
          userId: updateDailyNutritionDTO.userId,
          calorie: calorieRatio,
          carbohydrate: carbohydrateRatio,
          protein: proteinRatio,
          fat: fatRatio,
          sodium: sodiumRatio,
          log_date: new Date(updateDailyNutritionDTO.log_date),
        },
      });

      return intakeLog;
    });
  }

  async remove(id: number, user: AuthUser) {
    const exist = await this.findOne(id);
    checkPermission(user.role, exist.userId, user.id);
    return this.prisma.$transaction(async (tx) => {
      await tx.intake_logs.delete({
        where: { id },
      });

      // 삭제하자
      const dailyNutritionExist = await tx.daily_nutrition_logs.findUnique({
        where: {
          userId_log_date: {
            userId: exist.userId,
            log_date: exist.eaten_at,
          },
        },
      });
      if (dailyNutritionExist) {
        await tx.daily_nutrition_logs.delete({
          where: {
            userId_log_date: {
              userId: exist.userId,
              log_date: exist.eaten_at,
            },
          },
        });
      }

      return { deleted: id };
    });
  }
}
