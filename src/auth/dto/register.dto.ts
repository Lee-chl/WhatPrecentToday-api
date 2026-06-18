import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class registerDto {
  @ApiProperty({ example: 'a@a.com' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ example: '김철수' })
  name: string;

  @IsString()
  @MinLength(6)
  password: string;
}
