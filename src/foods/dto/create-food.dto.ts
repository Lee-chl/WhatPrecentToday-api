import {
  IsArray,
  IsInt,
  IsNumber,
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
  @IsNumber()
  @Min(0)
  calorie: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  carbohydrate: number;

  @ApiProperty({ example: 0.14 })
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  fat: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  sodium: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  NUTRI_AMOUNT_SERVING: number = 0;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  SERVING_SIZE: number = 0;

  @ApiProperty({ example: 710 })
  @IsNumber()
  @Min(0)
  total_capacity: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  categoryId?: number;
}
