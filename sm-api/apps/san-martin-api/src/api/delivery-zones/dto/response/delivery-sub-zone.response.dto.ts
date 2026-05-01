import { ApiProperty } from '@nestjs/swagger';
import {
  DeliverySubZonesEntity,
  DeliverySubZoneType,
  MapPolygon,
} from '@san-martin/san-martin-libs';

import { DeliverySubZoneTimeWorkResponseDto } from './delivery-sub-zone-time-work.response.dto';
import { DeliveryZoneResponseDto } from './delivery-zone.response.dto';

export class DeliverySubZoneResponseDto {
  @ApiProperty({ required: false })
  id: number;

  @ApiProperty({ required: false })
  deliveryZoneId?: number;

  @ApiProperty({ required: false, type: () => DeliveryZoneResponseDto })
  deliveryZone?: DeliveryZoneResponseDto;

  @ApiProperty({ type: () => [MapPolygon], required: false })
  deliveryZonePolygon?: MapPolygon[];

  @ApiProperty({ enum: DeliverySubZoneType, enumName: 'DeliverySubZoneType' })
  type: DeliverySubZoneType;

  @ApiProperty({ required: false })
  deliverySubZoneTimeWork?: DeliverySubZoneTimeWorkResponseDto;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  constructor(data: DeliverySubZonesEntity) {
    Object.assign(this, data.dataValues);

    if (data.deliverySubZoneTimeWork) {
      this.deliverySubZoneTimeWork = new DeliverySubZoneTimeWorkResponseDto(
        data.deliverySubZoneTimeWork,
      );
    }

    if (data.deliveryZone) {
      this.deliveryZone = new DeliveryZoneResponseDto(data.deliveryZone);
    }
  }
}
