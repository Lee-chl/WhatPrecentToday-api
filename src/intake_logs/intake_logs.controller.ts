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
import { IntakeLogsService } from './intake_logs.service';
import { CreateIntakeLogDto } from './dto/create-intake_log.dto';
import { UpdateIntakeLogDto } from './dto/update-intake_log.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { type AuthUser, CurrentUser } from 'src/common/current-user.decoraor';
import { QueryDto } from '../common/query.dto';

@Controller('intake-logs')
@ApiTags('intake-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntakeLogsController {
  constructor(private readonly intakeLogsService: IntakeLogsService) {}

  @Post()
  @ApiOperation({ summary: '음식 섭취한 기록 생성' })
  create(
    @Body() createIntakeLogDto: CreateIntakeLogDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.intakeLogsService.create(createIntakeLogDto, user);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.intakeLogsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.intakeLogsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntakeLogDto: UpdateIntakeLogDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.intakeLogsService.update(+id, updateIntakeLogDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.intakeLogsService.remove(id, user);
  }
}
