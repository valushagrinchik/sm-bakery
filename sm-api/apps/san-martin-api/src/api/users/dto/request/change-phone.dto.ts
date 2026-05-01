import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class ChangePhoneDto {
  @Validate(TypeValidate.STRING)
  phone: string;
  @Validate(TypeValidate.STRING)
  code: string;
}
