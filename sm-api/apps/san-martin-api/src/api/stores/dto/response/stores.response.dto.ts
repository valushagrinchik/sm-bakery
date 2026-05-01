import { ApiProperty } from '@nestjs/swagger';
import { EntityStatus, StoresEntity } from '@san-martin/san-martin-libs';

import { StoreDeliveryZoneResponseDto } from './store-delivery-zone.response.dto';
import { StoreOrderPerHoursResponseDto } from './store-order-per-hours.response.dto';
import { StoresTimeWorkResponseDto } from './stores-time-work.response.dto';
import { CountryResponseDto } from '../../../countries/dto/response/country.response.dto';
import { UserResponseDto } from '../../../users/dto/response/user.response.dto';

export class StoresResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  inventoryId: string;

  @ApiProperty({ required: false, enum: EntityStatus, enumName: 'EntityStatus' })
  status?: EntityStatus;

  @ApiProperty({ required: false })
  countryId?: number;

  @ApiProperty({ required: false })
  country?: CountryResponseDto;

  @ApiProperty({ required: false })
  servicePhone?: string;

  @ApiProperty({ required: false })
  standardDeliveryTime?: number;

  @ApiProperty({ required: false })
  maxOrderLag?: number;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  positionLat?: number;

  @ApiProperty({ required: false })
  positionLng?: number;

  @ApiProperty({ required: false })
  isDelivered?: boolean;

  @ApiProperty({ required: false, type: StoresTimeWorkResponseDto })
  storesTimeWork?: StoresTimeWorkResponseDto;

  @ApiProperty({ required: false, type: StoreDeliveryZoneResponseDto })
  storeDeliveryZone?: StoreDeliveryZoneResponseDto;

  @ApiProperty({ required: false, type: [StoreOrderPerHoursResponseDto] })
  storeOrderPerHours: StoreOrderPerHoursResponseDto[];

  @ApiProperty({ required: false, type: [UserResponseDto] })
  operators?: UserResponseDto[];

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  constructor(data: StoresEntity) {
    Object.assign(this, data.dataValues);

    if (data.country) {
      this.country = new CountryResponseDto(data.country);
    }

    if (data.storesTimeWork) {
      this.storesTimeWork = new StoresTimeWorkResponseDto(data.storesTimeWork);
    }

    if (data.storeDeliveryZone) {
      this.storeDeliveryZone = new StoreDeliveryZoneResponseDto(data.storeDeliveryZone);
    }

    if (data.storeOrderPerHours) {
      this.storeOrderPerHours = data.storeOrderPerHours.map(
        (orderPerHour) => new StoreOrderPerHoursResponseDto(orderPerHour),
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
