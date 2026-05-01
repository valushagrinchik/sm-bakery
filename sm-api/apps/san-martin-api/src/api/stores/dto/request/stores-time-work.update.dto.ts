import { PartialType } from '@nestjs/swagger';

import { StoresTimeWorkCreateDto } from './stores-time-work.create.dto';

export class StoresTimeWorkUpdateDto extends PartialType(StoresTimeWorkCreateDto) {}
