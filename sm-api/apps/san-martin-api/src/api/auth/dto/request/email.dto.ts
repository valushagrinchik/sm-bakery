import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';

export class EmailDto {
  @Validate(TypeValidate.EMAIL, {
    required: true,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
