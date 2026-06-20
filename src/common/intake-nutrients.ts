import { BadRequestException } from '@nestjs/common';

interface Nutrients {
  calorie: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  sodium: number;
}

interface GoalNutrients {
  calorie_goal: number;
  carbohydrate_goal: number;
  protein_goal: number;
  fat_goal: number;
  sodium_goal: number;
}

interface IntakeNutrientType {
  intake: number;
  nutrients: Nutrients;
  servingSize: number;
}
export const intakeNutrients = ({
  intake,
  nutrients,
  servingSize,
}: IntakeNutrientType) => {
  checkNutrients(intake, nutrients, servingSize);
  // 섭취량 / 영양성분 기준량
  const ratio = intake / servingSize;
  // 탄 단 지 나트륨 계산
  const calorie = ratio * nutrients.calorie;
  const carbohydrate = ratio * nutrients.carbohydrate;
  const protein = ratio * nutrients.protein;
  const fat = ratio * nutrients.fat;
  const sodium = ratio * nutrients.sodium;
  return { calorie, carbohydrate, protein, fat, sodium };
};

const checkNutrients = (
  intake: number,
  nutrients: Nutrients,
  servingSize: number,
) => {
  if (intake === null || intake < 0)
    throw new BadRequestException(
      'intake 값이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
  if (nutrients.calorie === null || nutrients.calorie < 0)
    throw new BadRequestException(
      '칼로리 값이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
  if (nutrients.carbohydrate === null || nutrients.carbohydrate < 0)
    throw new BadRequestException(
      '탄수화물 값이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
  if (nutrients.protein === null || nutrients.protein < 0)
    throw new BadRequestException(
      '단백질 값이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
  if (nutrients.fat === null || nutrients.fat < 0)
    throw new BadRequestException(
      '지방 값이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
  if (nutrients.sodium === null || nutrients.sodium < 0)
    throw new BadRequestException(
      '나트륨 값이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
  if (servingSize === null || servingSize < 0)
    throw new BadRequestException(
      '영양성분 기준량이 이상해요(빈 값이거나 음수가 아니게 해주세요)',
    );
};

export const percentNutrition = (nutrients: Nutrients, goal: GoalNutrients) => {
  const perCalorie = ((nutrients.calorie / goal.calorie_goal) * 100).toFixed(2);
  const perCarbohydrate = (
    (nutrients.carbohydrate / goal.carbohydrate_goal) *
    100
  ).toFixed(2);
  const perProtein = ((nutrients.protein / goal.protein_goal) * 100).toFixed(2);
  const perFat = ((nutrients.fat / goal.fat_goal) * 100).toFixed(2);
  const perSodium = ((nutrients.sodium / goal.sodium_goal) * 100).toFixed(2);
  return { perCalorie, perCarbohydrate, perProtein, perFat, perSodium };
};
