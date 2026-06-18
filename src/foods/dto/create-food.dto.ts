import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDto {
  @IsString()
  @ApiProperty({ example: '아메리카노' })
  @MinLength(1)
  name: string;

  @ApiProperty({ example: '메가커피' })
  @MinLength(1)
  @IsString()
  brandName: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  calorie: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  carbohydrate: number;

  @ApiProperty({ example: 0.14 })
  @IsInt()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  fat: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  sodium: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  @IsOptional()
  NUTRI_AMOUNT_SERVING: number = 0;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  @IsOptional()
  SERVING_SIZE: number = 0;

  @ApiProperty({ example: 710 })
  @IsInt()
  @Min(0)
  total_capacity: number;

  @ApiProperty({ example: 1 })
  @IsArray()
  @IsInt({ each: true })
  categoryIds: number[];
}
