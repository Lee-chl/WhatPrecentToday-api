import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateIntakeLogDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  foodId: number;

  @ApiProperty({ example: 100, description: '섭취량(g)' })
  @Min(0)
  @IsNumber()
  intake: number;

  @ApiProperty({ example: 10, description: '먹은 칼로리(g)' })
  @Min(0)
  @IsNumber()
  calories: number;

  @ApiProperty({ example: 10, description: '먹은 탄수화물(g)' })
  @IsNumber()
  @Min(0)
  carbohydrate: number;

  @ApiProperty({ example: 10, description: '먹은 단백질(g)' })
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 10, description: '먹은 지방(g)' })
  @IsNumber()
  @Min(0)
  fat: number;

  @ApiProperty({ example: 10, description: '먹은 나트륨(g)' })
  @IsNumber()
  @Min(0)
  sodium: number;
}
