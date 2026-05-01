import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class ResetChangeQueryDto {
  @Validate(TypeValidate.STRING, { required: true })
  token: string;
}
