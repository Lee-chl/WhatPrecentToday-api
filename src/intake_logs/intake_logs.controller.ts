import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IntakeLogsService } from './intake_logs.service';
import { CreateIntakeLogDto } from './dto/create-intake_log.dto';
import { UpdateIntakeLogDto } from './dto/update-intake_log.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { type AuthUser, CurrentUser } from 'src/common/current-user.decoraor';

@Controller('intake-logs')
@ApiTags('intake-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntakeLogsController {
  constructor(private readonly intakeLogsService: IntakeLogsService) {}

  @Post()
  create(
    @Body() createIntakeLogDto: CreateIntakeLogDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.intakeLogsService.create(createIntakeLogDto);
  }

  @Get()
  findAll() {
    return this.intakeLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intakeLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntakeLogDto: UpdateIntakeLogDto,
  ) {
    return this.intakeLogsService.update(+id, updateIntakeLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intakeLogsService.remove(+id);
  }
}
