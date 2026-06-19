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
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/current-user.decoraor';
import { QueryDto } from '../common/query.dto';

@Controller('foods')
@ApiTags('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @ApiOperation({ summary: '음식 추가' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createFoodDto: CreateFoodDto,
    @CurrentUser('role') userRole: string,
  ) {
    return this.foodsService.create(createFoodDto, userRole);
  }

  @Get()
  @ApiOperation({ summary: '모든 음식 찾기' })
  findAll(@Query() query: QueryDto) {
    return this.foodsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '음식 하나 찾기' })
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '음식 수정' })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
    @CurrentUser('role') userRole: string,
  ) {
    return this.foodsService.update(+id, updateFoodDto, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '음식 삭제' })
  remove(@Param('id') id: string, @CurrentUser('role') userRole: string) {
    return this.foodsService.remove(+id, userRole);
  }
}
