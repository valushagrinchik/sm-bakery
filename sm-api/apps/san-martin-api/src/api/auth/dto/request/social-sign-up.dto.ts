import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

import { SocialAuthCommonDto } from '../social-auth-common.dto';

export class SocialSignUpDto extends SocialAuthCommonDto {
  @Validate(TypeValidate.BOOLEAN)
  isNeedEmailVerification: boolean;
}
