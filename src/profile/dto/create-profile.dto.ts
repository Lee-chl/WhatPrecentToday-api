import { Gender } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 100 })
  weight: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 170 })
  height: number;

  @IsEnum(Gender)
  @ApiProperty({ example: 'Woman' })
  gender: Gender;

  @IsInt()
  @IsOptional()
  age: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 2000 })
  calorie_goal: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 250 })
  carbohydrate_goal: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 100 })
  protein_goal: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 65 })
  fat_goal: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 2000 })
  sodium_goal: number;
}
