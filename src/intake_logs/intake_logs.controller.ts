import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IntakeLogsService } from './intake_logs.service';
import { CreateIntakeLogDto } from './dto/create-intake_log.dto';
import { UpdateIntakeLogDto } from './dto/update-intake_log.dto';

@Controller('intake-logs')
export class IntakeLogsController {
  constructor(private readonly intakeLogsService: IntakeLogsService) {}

  @Post()
  create(@Body() createIntakeLogDto: CreateIntakeLogDto) {
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
  update(@Param('id') id: string, @Body() updateIntakeLogDto: UpdateIntakeLogDto) {
    return this.intakeLogsService.update(+id, updateIntakeLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intakeLogsService.remove(+id);
  }
}
