import { ApiProperty } from '@nestjs/swagger';
import {
  PlatformType,
  ProviderType,
  TypeValidate,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { SocialAuthUserInfoDto } from './social-auth-user-info.dto';

export class SocialAuthCommonDto {
  @Validate(TypeValidate.STRING, {
    type: String,
    example: '<access_token>',
  })
  token: string;

  @ValidateEnum(PlatformType, {
    example: PlatformType.IOS,
  })
  platformType: PlatformType;

  @ValidateEnum(ProviderType, {
    example: ProviderType.GOOGLE,
  })
  providerType: ProviderType;

  @ApiProperty({
    required: true,
    type: SocialAuthUserInfoDto,
  })
  @ValidateNested()
  @Type(() => SocialAuthUserInfoDto)
  userInfo: SocialAuthUserInfoDto;
}
