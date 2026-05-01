import { PartialType } from '@nestjs/swagger';

import { DeliveryZoneTimeWorkCreateDto } from './delivery-zone-time-work.create.dto';

export class DeliveryZoneTimeWorkUpdateDto extends PartialType(DeliveryZoneTimeWorkCreateDto) {}
