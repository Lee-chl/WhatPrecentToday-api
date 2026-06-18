import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateCategoryDto {
  @ApiProperty({ example: '한식' })
  @IsString()
  name: string;

  @ApiProperty({ example: '한국의 음식' })
  @IsString()
  @Optional()
  description: string = '';

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  foodId: number;
}
