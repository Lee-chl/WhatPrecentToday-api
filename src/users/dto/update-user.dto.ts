import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: '김철수' })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({ example: '123123123' })
  password: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'a@a.com' })
  email: string;
}
