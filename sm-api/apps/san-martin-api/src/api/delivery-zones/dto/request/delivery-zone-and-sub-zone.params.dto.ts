import { FindOneParamsDto, TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class DeliveryZoneAndSubZoneParamsDto extends FindOneParamsDto {
  @Validate(TypeValidate.NUMBER)
  subZoneId: number;
}
