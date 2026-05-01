import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class AuthDto {
  @Validate(TypeValidate.NUMBER)
  userId: number;
}
