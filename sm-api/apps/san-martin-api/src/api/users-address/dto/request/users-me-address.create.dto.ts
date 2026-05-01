import {
  ToBoolean,
  TypeValidate,
  UserAddressType,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';

export class UsersMeAddressCreateDto {
  @ValidateEnum(UserAddressType, { enum: UserAddressType, enumName: 'UserAddressType' })
  type: UserAddressType;

  @Validate(TypeValidate.STRING)
  country: string;

  @Validate(TypeValidate.STRING)
  city: string;

  @Validate(TypeValidate.STRING)
  state: string;

  @Validate(TypeValidate.STRING)
  subLocality: string;

  @Validate(TypeValidate.STRING)
  address: string;

  @Validate(TypeValidate.LATITUDE)
  positionLat: number;

  @Validate(TypeValidate.LONGITUDE)
  positionLng: number;

  @Validate(TypeValidate.STRING, { required: false })
  addressDetails?: string;

  @Validate(TypeValidate.NUMBER, { required: false })
  floorNumber?: number;

  @Validate(TypeValidate.STRING, { required: false })
  doorNumber?: string;

  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  isDefault?: boolean;
}
