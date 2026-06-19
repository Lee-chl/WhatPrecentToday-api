import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerDto } from '../auth/dto/register.dto';
import { type AuthUser } from '../common/current-user.decoraor';
import { QueryUserDto } from './dto/query-user.dto';
import { checkPermission } from 'src/common/checkPermission';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: registerDto) {
    return this.prisma.users.create({ data: createUserDto });
  }

  async findAll(query: QueryUserDto, userRole: string) {
    // 권한 확인 후 모두 조회
    checkPermission(userRole);

    const { page, limit } = query;
    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.users.count(),
    ]);
    return { users, total, page, limit, totalPage: Math.ceil(total / limit) };
  }

  async findOne(id: number, user: AuthUser) {
    // 권한 확인 후 관리자면 조회 가능
    // 관리자가 아닐 경우 본인 id만 가능
    if (user.role !== 'ADMIN' && id !== user.id)
      throw new ForbiddenException('해당 권한이 없습니다.');
    // 진짜 유저가 있나 확인
    const exists = await this.prisma.users.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`${id} 유저가 없습니다.`);

    return exists;
  }

  findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const exists = await this.prisma.users.findUnique({
        where: { email: updateUserDto.email },
      });

      if (exists) throw new BadRequestException('요청을 처리할 수 없습니다.');
    }

    const user = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
    const { password, ...result } = user;
    return result;
  }

  async remove(id: number, user: AuthUser) {
    checkPermission(user.role);
    await this.findOne(id, user);
    await this.prisma.users.delete({ where: { id } });
    return { deleted: id };
  }
}
