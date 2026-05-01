import { OmitType } from '@nestjs/swagger';

import { SocialAuthCommonDto } from '../social-auth-common.dto';

export class SocialSignInDto extends OmitType(SocialAuthCommonDto, ['userInfo'] as const) {}
