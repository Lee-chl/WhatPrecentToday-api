import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '한식' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: '한국의 음식' })
  @IsString()
  @IsOptional()
  description: string = '';

  @IsOptional()
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  foodId: number;
}
