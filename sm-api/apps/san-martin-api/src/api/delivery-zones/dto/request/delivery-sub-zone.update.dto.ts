import { PartialType } from '@nestjs/swagger';

import { DeliverySubZoneCreateDto } from './delivery-sub-zone.create.dto';

export class DeliverySubZoneUpdateDto extends PartialType(DeliverySubZoneCreateDto) {}
