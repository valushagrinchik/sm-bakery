import { OmitType, PartialType } from '@nestjs/swagger';

import { DeliveryZoneCreateDto } from './delivery-zone.create.dto';

export class DeliveryZoneUpdateDto extends OmitType(PartialType(DeliveryZoneCreateDto), [
  'deliverySubZones',
  'deliveryZoneTimeWork',
] as const) {}
