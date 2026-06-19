import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '한식' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: '한국의 음식' })
  @IsString()
  @IsOptional()
  description: string = '';
}
