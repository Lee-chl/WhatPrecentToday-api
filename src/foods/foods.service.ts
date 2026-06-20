import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkPermissionRole } from 'src/common/checkPermission';
import { QueryDto } from '../common/query.dto';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFoodDto: CreateFoodDto, userRole: string) {
    // 권한 체크
    checkPermissionRole(userRole);
    // 이미 있는 food+브랜드 인지 확인
    const exists = await this.prisma.foods.findFirst({
      where: { name: createFoodDto.name, brandName: createFoodDto.brandName },
    });
    if (exists) {
      throw new ConflictException(
        `이미 있는 브랜드: ${createFoodDto.brandName}과 식품: ${createFoodDto.name} 입니다.`,
      );
    }

    // 카테고리가 있다면 존재 확인
    if (createFoodDto.categoryId) {
      const category = await this.prisma.categories.findUnique({
        where: { id: createFoodDto.categoryId },
      });
      if (!category)
        throw new NotFoundException(
          `카테고리 ${createFoodDto.categoryId}가 없습니다.`,
        );
    }
    return this.prisma.foods.create({ data: createFoodDto });
  }

  async findAll(query: QueryDto) {
    const { page, limit } = query;
    const [foods, total] = await Promise.all([
      this.prisma.foods.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.foods.count(),
    ]);
    return { foods, total, page, limit, totalPage: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const exists = await this.prisma.foods.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`${id}는 없는 음식입니다.`);
    return exists;
  }

  async update(id: number, updateFoodDto: UpdateFoodDto, userRole: string) {
    checkPermissionRole(userRole);
    await this.findOne(id);

    // 카테고리가 있다면 존재 확인
    if (updateFoodDto.categoryId) {
      const category = await this.prisma.categories.findUnique({
        where: { id: updateFoodDto.categoryId },
      });
      if (!category)
        throw new NotFoundException(
          `카테고리 ${updateFoodDto.categoryId}가 없습니다.`,
        );
    }
    if (updateFoodDto.name && updateFoodDto.brandName) {
      // 이미 있는 food+브랜드 인지 확인
      const exists = await this.prisma.foods.findFirst({
        where: { name: updateFoodDto.name, brandName: updateFoodDto.brandName },
      });
      if (exists) {
        throw new ConflictException(
          `이미 있는 브랜드: ${updateFoodDto.brandName}과 식품: ${updateFoodDto.name} 입니다.`,
        );
      }
    }

    return this.prisma.foods.update({ where: { id }, data: updateFoodDto });
  }

  async remove(id: number, userRole: string) {
    checkPermissionRole(userRole);
    await this.findOne(id);
    await this.prisma.foods.delete({ where: { id } });
    return { deleted: id };
  }
}
