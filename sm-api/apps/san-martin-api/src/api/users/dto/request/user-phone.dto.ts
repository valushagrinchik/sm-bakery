import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class UserPhoneDto {
  @Validate(TypeValidate.STRING)
  phoneNumber: string;
}
