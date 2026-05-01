import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class UserSmsCodeDto {
  @Validate(TypeValidate.STRING, { required: true })
  code: string;
}
