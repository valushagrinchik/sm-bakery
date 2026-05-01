import { ApiProperty } from '@nestjs/swagger';
import {
  EntityStatus,
  ToBoolean,
  TypeValidate,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

import { StoreOrderPerHoursDto } from './store-order-per-hours.dto';
import { StoresTimeWorkCreateDto } from './stores-time-work.create.dto';

export class StoresCreateDto {
  @Validate(TypeValidate.STRING)
  name: string;

  @Validate(TypeValidate.NUMBER)
  countryId: number;

  @Validate(TypeValidate.STRING)
  inventoryId: string;

  @ApiProperty({ required: false })
  @Validate(TypeValidate.STRING)
  @ValidateIf((o) => {
    return o.status === EntityStatus.ACTIVE && !o.servicePhone;
  })
  @IsNotEmpty()
  servicePhone?: string;

  @ApiProperty({ required: false })
  @Validate(TypeValidate.NUMBER)
  @ValidateIf((o) => {
    return o.status === EntityStatus.ACTIVE && !o.standardDeliveryTime;
  })
  @IsNotEmpty()
  standardDeliveryTime?: number;

  @ApiProperty({ required: false })
  @Validate(TypeValidate.NUMBER)
  @ValidateIf((o) => {
    return o.status === EntityStatus.ACTIVE && !o.maxOrderLag;
  })
  @IsNotEmpty()
  maxOrderLag?: number;

  @ApiProperty({ required: false })
  @Validate(TypeValidate.STRING)
  @ValidateIf((o) => {
    return o.status === EntityStatus.ACTIVE && !o.address;
  })
  @IsNotEmpty()
  address?: string;

  @ApiProperty({ required: false })
  @Validate(TypeValidate.LATITUDE)
  @ValidateIf((o) => {
    return o.status === EntityStatus.ACTIVE && !o.positionLat;
  })
  @IsNotEmpty()
  positionLat?: number;

  @ApiProperty({ required: false })
  @Validate(TypeValidate.LONGITUDE)
  @ValidateIf((o) => {
    return o.status === EntityStatus.ACTIVE && !o.positionLng;
  })
  @IsNotEmpty()
  positionLng?: number;

  @ValidateEnum(EntityStatus, { required: false })
  status?: EntityStatus = EntityStatus.INACTIVE;

  @Validate(TypeValidate.NUMBER, { required: false })
  deliveryZoneId?: number;

  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  isMainStore?: boolean;

  @Validate(TypeValidate.OBJECT, { required: false, type: StoresTimeWorkCreateDto })
  @ValidateNested()
  storeTimeWork?: StoresTimeWorkCreateDto;

  @Validate(TypeValidate.ARRAY, { required: false, type: [StoreOrderPerHoursDto] })
  @Transform(({ value }) =>
    value.map((item: StoreOrderPerHoursDto) => ({
      weekName: item.weekName,
      listOrderPerHours: item.listOrderPerHours,
    })),
  )
  storeOrderPerHours?: StoreOrderPerHoursDto[];
}
