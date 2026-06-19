import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateIntakeLogDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  foodId: number;

  // 섭취량 (g)
  @IsOptional()
  @ApiProperty({ example: 30 })
  @Min(0)
  @IsNumber()
  intake: number;

  // 해당 상품의 먹은 칼로리(g)
  @Min(0)
  @IsOptional()
  @IsNumber()
  calorie: number;

  // 해당 상품의 먹은 탄수화물(g)
  @IsNumber()
  @IsOptional()
  @Min(0)
  carbohydrate: number;

  // 해당 상품의 먹은 단백질(g)
  @IsNumber()
  @IsOptional()
  @Min(0)
  protein: number;

  // 해당 상품의 먹은 지방(g)
  @IsNumber()
  @IsOptional()
  @Min(0)
  fat: number;

  // 해당 상품의 먹은 나트륨(g)
  @IsNumber()
  @IsOptional()
  @Min(0)
  sodium: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2026-06-19T00:00:00+09:00' })
  eaten_at: Date;
}
