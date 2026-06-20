import { Gender } from '@prisma/client';
import { Optional } from '@nestjs/common';
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
  @Min(1)
  age: number;

  @Optional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 2000 })
  @Min(1)
  calorie_goal: number;

  @Optional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 250 })
  @Min(1)
  carbohydrate_goal: number;

  @Optional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 100 })
  @Min(1)
  protein_goal: number;

  @Optional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 65 })
  @Min(1)
  fat_goal: number;

  @Optional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ example: 2000 })
  @Min(1)
  sodium_goal: number;
}
