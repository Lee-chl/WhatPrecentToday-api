import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DailyNutritionLogsService } from './daily_nutrition_logs.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { QueryDto } from '../common/query.dto';
import { type AuthUser, CurrentUser } from '../common/current-user.decoraor';

@Controller('daily-nutrition-logs')
@ApiTags('Daily Nutrition logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DailyNutritionLogsController {
  constructor(
    private readonly dailyNutritionLogsService: DailyNutritionLogsService,
  ) {}

  @Get()
  @ApiOperation({ summary: '데일리 영양 로그 조회' })
  findAll(@Query() query: QueryDto, @CurrentUser('role') userRole: string) {
    return this.dailyNutritionLogsService.findAll(query, userRole);
  }

  @Get(':id')
  @ApiOperation({ summary: '데일리 영양 로그 하나 조회' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.dailyNutritionLogsService.findOne(id, user);
  }
}
