import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { type AuthUser } from '../common/current-user.decoraor';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: registerDto) {
    // 유저 체크
    const user = await this.userService.findByEmail(dto.email);
    if (user) throw new ConflictException(`이미 있는 사용자입니다.`);
    // 비밀번호 암호화
    const hashed = await bcrypt.hash(dto.password, jwtConstants.round);
    const newUser = await this.userService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
    });
    const { password, ...result } = newUser;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 틀려요');

    const isRight = await bcrypt.compare(dto.password, user.password);
    if (!isRight)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀려요');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, user: AuthUser) {
    // 사용자 확인
    await this.userService.findOne(id, user);
    if (updateUserDto.password) {
      // 비밀번호 암호화
      const hashed = await bcrypt.hash(
        updateUserDto.password,
        jwtConstants.round,
      );
      updateUserDto.password = hashed;
    }
    return this.userService.update(id, updateUserDto);
  }
}
