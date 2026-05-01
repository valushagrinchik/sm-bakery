import { OmitType } from '@nestjs/swagger';

import { CreateSocialCustomerDto } from './create-social-customer.dto';

export class CreateSocialUserDto extends OmitType(CreateSocialCustomerDto, [
  'platformType',
] as const) {}
