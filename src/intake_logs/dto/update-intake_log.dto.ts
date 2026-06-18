import { PartialType } from '@nestjs/mapped-types';
import { CreateIntakeLogDto } from './create-intake_log.dto';

export class UpdateIntakeLogDto extends PartialType(CreateIntakeLogDto) {}
