import {
  errorMessage,
  ErrorValidationEnum,
  TypeValidate,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';
import { DeliverySubZoneType } from '@san-martin/san-martin-libs/common/types/delivery-sub-zone-type';
import { ArrayMinSize, ValidateNested } from 'class-validator';

import { DeliverySubZoneTimeWorkCreateDto } from './delivery-sub-zone-time-work.create.dto';
import { PolygonDto } from './delivery-zone.create.dto';

export class DeliverySubZoneCreateDto {
  @Validate(TypeValidate.NUMBER, {
    required: false,
    description: 'This parameter must be passed to update an existing sub zone',
  })
  id?: number;

  @Validate(TypeValidate.ARRAY, { type: () => [PolygonDto] })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: (value) => errorMessage(value, ErrorValidationEnum.IS_NOT_EMPTY),
  })
  deliveryZonePolygon: PolygonDto[];

  @ValidateEnum(DeliverySubZoneType, { enum: DeliverySubZoneType, enumName: 'DeliverySubZoneType' })
  type: DeliverySubZoneType;

  @Validate(TypeValidate.OBJECT, { required: false, type: DeliverySubZoneTimeWorkCreateDto })
  @ValidateNested()
  deliverySubZoneTimeWork?: DeliverySubZoneTimeWorkCreateDto;
}
