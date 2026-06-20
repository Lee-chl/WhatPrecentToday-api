import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '반찬류' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: '반찬으로 먹기 좋은 것' })
  @IsString()
  @IsOptional()
  description: string = '';
}
