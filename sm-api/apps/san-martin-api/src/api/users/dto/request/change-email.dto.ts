import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';

export class ChangeEmailDto {
  @Validate(TypeValidate.EMAIL)
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  @Validate(TypeValidate.STRING)
  code: string;
}
