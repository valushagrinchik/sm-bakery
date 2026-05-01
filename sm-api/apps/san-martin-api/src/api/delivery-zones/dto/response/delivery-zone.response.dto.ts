import { ApiProperty } from '@nestjs/swagger';
import { DeliveryZonesEntity, EntityStatus, MapPolygon } from '@san-martin/san-martin-libs';

import { DeliverySubZoneResponseDto } from './delivery-sub-zone.response.dto';
import { DeliveryZoneStoresResponseDto } from './delivery-zone-stores.response.dto';
import { DeliveryZoneTimeWorkResponseDto } from './delivery-zone-time-work.response.dto';
import { CountryResponseDto } from '../../../countries/dto/response/country.response.dto';
import { UserResponseDto } from '../../../users/dto/response/user.response.dto';

export class DeliveryZoneResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  countryId?: number;

  @ApiProperty({ required: false })
  country?: CountryResponseDto;

  @ApiProperty({ required: false, enum: EntityStatus, enumName: 'EntityStatus' })
  status?: EntityStatus;

  @ApiProperty({ required: false })
  minOrderAmount?: number;

  @ApiProperty({ required: false })
  maxOrderAmount?: number;

  @ApiProperty({ required: false })
  standardDeliveryTime?: number;

  @ApiProperty({ type: [MapPolygon], required: false })
  deliveryZonePolygon?: MapPolygon[];

  @ApiProperty({ required: false })
  deliveryZoneTimeWork?: DeliveryZoneTimeWorkResponseDto;

  @ApiProperty({ type: () => [DeliverySubZoneResponseDto], required: false })
  deliverySubZones?: DeliverySubZoneResponseDto[];

  @ApiProperty({ type: [DeliveryZoneStoresResponseDto], required: false })
  storeDeliveryZones?: DeliveryZoneStoresResponseDto[];

  @ApiProperty({ type: [UserResponseDto] })
  operators: UserResponseDto[];

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  subZoneCount?: number;

  constructor(data: DeliveryZonesEntity, subZoneCount?: number) {
    Object.assign(this, data.dataValues);

    if (data.country) {
      this.country = new CountryResponseDto(data.country);
    }

    if (subZoneCount !== undefined) {
      this.subZoneCount = subZoneCount;
    }

    if (data.deliveryZoneTimeWork) {
      this.deliveryZoneTimeWork = new DeliveryZoneTimeWorkResponseDto(data.deliveryZoneTimeWork);
    }

    if (data.deliverySubZones && data.deliverySubZones.length !== 0) {
      this.deliverySubZones = data.deliverySubZones.map(
        (deliverySubZones) => new DeliverySubZoneResponseDto(deliverySubZones),
      );
    } else {
      this.deliverySubZones = undefined;
    }

    if (data.storeDeliveryZones) {
      this.storeDeliveryZones = data.storeDeliveryZones.map(
        (storeDeliveryZone) =>
          new DeliveryZoneStoresResponseDto(storeDeliveryZone, storeDeliveryZone.isMainStore),
      );
    }

    if (data.operators && data.operators.length !== 0) {
      this.operators = data.operators
        .map((operator) => new UserResponseDto(operator))
        .map((operator) => {
          if (operator['OperatorsEntity']) {
            delete operator['OperatorsEntity'];
          }
          return operator;
        });
    }
  }
}
