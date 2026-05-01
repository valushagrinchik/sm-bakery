import { ToBoolean, TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class ConfigureAddressAndDeliveryZoneDto {
  @Validate(TypeValidate.STRING, { required: false })
  address?: string;

  @Validate(TypeValidate.LATITUDE, { required: false })
  positionLat?: number;

  @Validate(TypeValidate.LONGITUDE, { required: false })
  positionLng?: number;

  @Validate(TypeValidate.NUMBER, { required: false })
  deliveryZoneId?: number;

  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  isMainStore?: boolean;
}
