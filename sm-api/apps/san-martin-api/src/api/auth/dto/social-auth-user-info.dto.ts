import { OmitType, PartialType } from '@nestjs/swagger';
import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';

import { SignUpCustomerDto } from './request/sign-up-customer.dto';

export class SocialAuthUserInfoDto extends PartialType(
  OmitType(SignUpCustomerDto, ['password', 'email'] as const),
) {
  @Validate(TypeValidate.EMAIL, {
    required: false,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;
}
