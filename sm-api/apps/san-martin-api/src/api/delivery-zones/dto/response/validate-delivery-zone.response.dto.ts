import { ApiProperty } from '@nestjs/swagger';

import { DeliverySubZoneResponseDto } from './delivery-sub-zone.response.dto';
import { DeliveryZoneResponseDto } from './delivery-zone.response.dto';

export class ValidateDeliveryZoneResponseDto {
  @ApiProperty({ required: false, type: DeliveryZoneResponseDto })
  deliveryZone?: DeliveryZoneResponseDto;
  @ApiProperty({ required: false, type: DeliverySubZoneResponseDto })
  deliverySubZone?: DeliverySubZoneResponseDto;
}
