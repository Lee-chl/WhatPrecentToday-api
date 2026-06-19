import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { type AuthUser, CurrentUser } from '../common/current-user.decoraor';
import { PrismaService } from '../prisma/prisma.service';
import { checkPermission } from '../common/checkPermission';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createProfileDto: CreateProfileDto,
    @CurrentUser() user: AuthUser,
  ) {
    // 권한 과 같은 id인지 확인
    checkPermission(user.role, createProfileDto.userId, user.id);

    // 유저 확인(관리자 위해)
    const userCheck = await this.prisma.users.findUnique({
      where: { id: createProfileDto.userId },
    });
    if (!userCheck) throw new NotFoundException('유저가 없습니다.');

    // 이미 있는 지 확인
    const exists = await this.prisma.profile.findUnique({
      where: { userId: createProfileDto.userId },
    });
    if (exists)
      throw new ConflictException(
        '이미 프로파일이 있으십니다. 수정으로 부탁드려요',
      );

    return this.prisma.profile.create({ data: createProfileDto });
  }

  async findOne(id: number, user: AuthUser) {
    // 권한 확인 또는 같은 Id 확인
    checkPermission(user.role, user.id, id);

    // 진짜 있는 지 확인
    const exists = await this.prisma.profile.findUnique({
      where: { userId: id },
    });
    if (!exists) throw new NotFoundException('프로파일이 없어요 만들어주세요.');
    return exists;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, user: AuthUser) {
    await this.findOne(id, user);

    return this.prisma.profile.update({
      where: { userId: id },
      data: updateProfileDto,
    });
  }
}
