import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class ValidateDeliveryZoneDto {
  @Validate(TypeValidate.LATITUDE)
  lat: number;
  @Validate(TypeValidate.LONGITUDE)
  lng: number;
  @Validate(TypeValidate.NUMBER, { required: false })
  deliveryZoneId?: number;
}
