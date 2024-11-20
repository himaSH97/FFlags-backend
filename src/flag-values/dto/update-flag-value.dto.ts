import { PartialType } from '@nestjs/swagger';
import { CreateFlagValueDto } from './create-flag-value.dto';

export class UpdateFlagValueDto extends PartialType(CreateFlagValueDto) {}
