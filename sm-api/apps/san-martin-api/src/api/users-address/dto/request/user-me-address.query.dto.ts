import { ToBoolean, TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class UserMeAddressQueryDto {
  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  isCustomerCart: boolean;
}
