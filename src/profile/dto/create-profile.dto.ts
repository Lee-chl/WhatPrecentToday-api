import { Gender } from '@prisma/client';
import { Optional } from '@nestjs/common';
import { IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @Optional()
  @ApiProperty({ example: 2000 })
  calorie_goal: number;

  @Optional()
  @ApiProperty({ example: 250 })
  carbohydrate_goal: number;

  @Optional()
  @ApiProperty({ example: 100 })
  protein_goal: number;

  @Optional()
  @ApiProperty({ example: 65 })
  fat_goal: number;

  @Optional()
  @ApiProperty({ example: 2000 })
  sodium_goal: number;
}
