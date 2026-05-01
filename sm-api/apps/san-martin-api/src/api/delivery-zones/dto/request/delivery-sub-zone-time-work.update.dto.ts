import { PartialType } from '@nestjs/swagger';

import { DeliverySubZoneTimeWorkCreateDto } from './delivery-sub-zone-time-work.create.dto';

export class DeliverySubZoneTimeWorkUpdateDto extends PartialType(
  DeliverySubZoneTimeWorkCreateDto,
) {}
