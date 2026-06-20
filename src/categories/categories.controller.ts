import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/current-user.decoraor';
import { QueryDto } from '../common/query.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 추가' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser('role') userRole: string,
  ) {
    return this.categoriesService.create(createCategoryDto, userRole);
  }

  @Get()
  @ApiOperation({ summary: '모든 카테고리 조회' })
  findAll(@Query() query: QueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '카테고리 하나 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 수정' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser('role') userRole: string,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, userRole);
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 삭제' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.categoriesService.remove(id, userRole);
  }
}
