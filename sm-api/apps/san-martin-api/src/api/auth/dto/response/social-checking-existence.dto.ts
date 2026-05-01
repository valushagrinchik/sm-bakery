import { OmitType } from '@nestjs/swagger';
import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

import { SocialAuthCommonDto } from '../social-auth-common.dto';

export class SocialCheckingExistenceDto extends OmitType(SocialAuthCommonDto, [] as const) {
  @Validate(TypeValidate.BOOLEAN)
  hasUser: boolean;

  @Validate(TypeValidate.BOOLEAN)
  isEmailVerified: boolean;
}
