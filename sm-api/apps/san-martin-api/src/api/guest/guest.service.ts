import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AppConfigService,
  ErrorMessageEnum,
  OperationError,
  Platform,
  RoleId,
} from '@san-martin/san-martin-libs';

@Injectable()
export class GuestService {
  constructor(
    private jwtService: JwtService,
    private appConfig: AppConfigService,
  ) {}

  async createGuestToken(platform: string | string[] | undefined) {
    if (platform !== Platform.CustomerApp) {
      throw new OperationError(ErrorMessageEnum.USER_PLATFORM_ERROR, HttpStatus.BAD_REQUEST);
    }

    return {
      accessToken: await this.jwtService.signAsync(
        { user: 'guest', roleId: RoleId.Customer },
        { secret: this.appConfig.jwtSecret },
      ),
    };
  }
}
