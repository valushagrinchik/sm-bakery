import { ApiProperty } from '@nestjs/swagger';
import { StoreDeliveryZonesEntity } from '@san-martin/san-martin-libs';

import { DeliveryZoneResponseDto } from '../../../delivery-zones/dto/response/delivery-zone.response.dto';

export class StoreDeliveryZoneResponseDto {
  @ApiProperty()
  deliveryZoneId: number;

  @ApiProperty({ type: DeliveryZoneResponseDto })
  deliveryZone: DeliveryZoneResponseDto;

  @ApiProperty()
  isMainStore: boolean;

  constructor(data: StoreDeliveryZonesEntity) {
    Object.assign(this, data.dataValues);

    if (data.deliveryZone) {
      this.deliveryZone = new DeliveryZoneResponseDto(data.deliveryZone);
    }
  }
}
