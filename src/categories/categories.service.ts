import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkPermissionRole } from 'src/common/checkPermission';
import { QueryDto } from '../common/query.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto, userRole: string) {
    // 권한 확인
    checkPermissionRole(userRole);
    // 중복인지 확인
    const exists = await this.prisma.categories.findUnique({
      where: { name: createCategoryDto.name },
    });
    if (exists)
      throw new ConflictException(`${exists.name} 이미 있는 카테고리입니다. `);

    return this.prisma.categories.create({
      data: createCategoryDto,
    });
  }
  async findAll(query: QueryDto, userRole: string) {
    // 권한 확인
    checkPermissionRole(userRole);

    const { page, limit } = query;
    const [categories, total] = await Promise.all([
      this.prisma.categories.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.categories.count(),
    ]);

    return {
      categories,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userRole: string) {
    checkPermissionRole(userRole);

    const exists = await this.prisma.categories.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('존재하지 않는 카테고리입니다.');

    return exists;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userRole: string,
  ) {
    // 권한 , 카테고리 id가 있는 지 확인
    await this.findOne(id, userRole);

    // 중복 확인
    const exists = await this.prisma.categories.findUnique({
      where: { name: updateCategoryDto.name },
    });

    if (exists)
      throw new ConflictException(
        `${updateCategoryDto.name}은 이미 있는 이름이예요`,
      );

    return this.prisma.categories.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: number, userRole: string) {
    // 권한과 있는 지 확인
    await this.findOne(id, userRole);
    await this.prisma.categories.delete({ where: { id } });
    return { deleted: id };
  }
}
