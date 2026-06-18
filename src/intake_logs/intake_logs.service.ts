import { Injectable } from '@nestjs/common';
import { CreateIntakeLogDto } from './dto/create-intake_log.dto';
import { UpdateIntakeLogDto } from './dto/update-intake_log.dto';

@Injectable()
export class IntakeLogsService {
  create(createIntakeLogDto: CreateIntakeLogDto) {
    return 'This action adds a new intakeLog';
  }

  findAll() {
    return `This action returns all intakeLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} intakeLog`;
  }

  update(id: number, updateIntakeLogDto: UpdateIntakeLogDto) {
    return `This action updates a #${id} intakeLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} intakeLog`;
  }
}
