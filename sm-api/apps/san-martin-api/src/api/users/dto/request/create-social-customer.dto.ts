import { OmitType } from '@nestjs/swagger';
import { PlatformType, ProviderType } from '@san-martin/san-martin-libs';

import { CreateCustomerDto } from './create-customer.dto';

export class CreateSocialCustomerDto extends OmitType(CreateCustomerDto, [
  'password',
  'birthday',
] as const) {
  sub: string;
  authProvider: ProviderType;
  platformType: PlatformType;
}
