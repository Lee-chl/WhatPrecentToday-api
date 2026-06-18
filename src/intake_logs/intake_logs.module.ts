import { Module } from '@nestjs/common';
import { IntakeLogsService } from './intake_logs.service';
import { IntakeLogsController } from './intake_logs.controller';

@Module({
  controllers: [IntakeLogsController],
  providers: [IntakeLogsService],
})
export class IntakeLogsModule {}
