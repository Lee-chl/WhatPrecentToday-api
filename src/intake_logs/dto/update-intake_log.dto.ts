import { PartialType } from '@nestjs/swagger';
import { CreateIntakeLogDto } from './create-intake_log.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateIntakeLogDto extends PartialType(
  OmitType(CreateIntakeLogDto, ['userId', 'foodId'] as const),
) {}
