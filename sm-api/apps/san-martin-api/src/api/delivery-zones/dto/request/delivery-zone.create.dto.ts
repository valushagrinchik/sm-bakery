import { ApiProperty } from '@nestjs/swagger';
import {
  EntityStatus,
  errorMessage,
  ErrorValidationEnum,
  TypeValidate,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';
import { ArrayMinSize, MaxLength, MinLength, ValidateIf, ValidateNested } from 'class-validator';

import { DeliverySubZoneCreateDto } from './delivery-sub-zone.create.dto';
import { DeliveryZoneTimeWorkCreateDto } from './delivery-zone-time-work.create.dto';

export class PolygonDto {
  @Validate(TypeValidate.LATITUDE)
  lat: number;
  @Validate(TypeValidate.LONGITUDE)
  lng: number;
}

export class StoresDeliveryZone {
  @Validate(TypeValidate.NUMBER)
  storeId: number;

  @Validate(TypeValidate.BOOLEAN)
  isMainStore: boolean;
}

export class DeliveryZoneCreateDto {
  @Validate(TypeValidate.STRING)
  @MaxLength(50)
  name: string;

  @Validate(TypeValidate.NUMBER)
  countryId: number;

  @ValidateEnum(EntityStatus, { enum: EntityStatus, enumName: 'EntityStatus' })
  status: EntityStatus;

  @Validate(TypeValidate.STRING)
  @ValidateIf((o) => o.status == EntityStatus.ACTIVE)
  @MinLength(1)
  @MaxLength(1000)
  @ApiProperty({ description: 'required only for Active status' })
  minOrderAmount?: string;

  @Validate(TypeValidate.STRING)
  @ValidateIf((o) => o.status == EntityStatus.ACTIVE)
  @MinLength(1)
  @MaxLength(1000)
  @ApiProperty({ description: 'required only for Active status' })
  maxOrderAmount?: string;

  @Validate(TypeValidate.NUMBER, { required: false })
  standardDeliveryTime?: number;

  @Validate(TypeValidate.ARRAY, { type: [PolygonDto] })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: (value) => errorMessage(value, ErrorValidationEnum.IS_NOT_EMPTY),
  })
  deliveryZonePolygon: PolygonDto[];

  @Validate(TypeValidate.OBJECT, { type: DeliveryZoneTimeWorkCreateDto, required: false })
  @ValidateNested()
  deliveryZoneTimeWork?: DeliveryZoneTimeWorkCreateDto;

  @Validate(TypeValidate.ARRAY, { type: () => [DeliverySubZoneCreateDto], required: false })
  @ValidateNested({ each: true })
  deliverySubZones?: DeliverySubZoneCreateDto[];

  @Validate(TypeValidate.ARRAY, { type: () => [StoresDeliveryZone], required: false })
  @ValidateNested({ each: true })
  stores?: StoresDeliveryZone[];
}
