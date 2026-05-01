import { ApiProperty } from '@nestjs/swagger';
import { EntityStatus, StoreDeliveryZonesEntity } from '@san-martin/san-martin-libs';

import { StoreOrderPerHoursResponseDto } from '../../../stores/dto/response/store-order-per-hours.response.dto';
import { StoresTimeWorkResponseDto } from '../../../stores/dto/response/stores-time-work.response.dto';

export class DeliveryZoneStoresResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, enum: EntityStatus })
  status?: EntityStatus;

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
  isMainStore?: boolean;

  @ApiProperty({ required: false, type: StoresTimeWorkResponseDto })
  storesTimeWork?: StoresTimeWorkResponseDto;

  @ApiProperty({ required: false, type: [StoreOrderPerHoursResponseDto] })
  storeOrderPerHours: StoreOrderPerHoursResponseDto[];

  constructor(data: StoreDeliveryZonesEntity, isMainStore: boolean) {
    this.id = data.store.id;
    this.name = data.store.name;
    this.servicePhone = data.store.servicePhone;
    this.standardDeliveryTime = data.store.standardDeliveryTime;
    this.maxOrderLag = data.store.maxOrderLag;
    this.status = data.store.status;
    this.address = data.store.address;
    this.positionLat = data.store.positionLat;
    this.positionLng = data.store.positionLng;
    this.isMainStore = isMainStore;
    if (data.store.storesTimeWork) {
      this.storesTimeWork = new StoresTimeWorkResponseDto(data.store.storesTimeWork);
    }
    if (data.store.storeOrderPerHours) {
      this.storeOrderPerHours = data.store.storeOrderPerHours.map(
        (storeOrderPerHour) => new StoreOrderPerHoursResponseDto(storeOrderPerHour),
      );
    }
  }
}
