import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'a@a.com' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123123123' })
  password: string;
}
