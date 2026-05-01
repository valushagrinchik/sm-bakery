import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AppConfigService,
  ErrorMessageEnum,
  OperationError,
  Platform,
  UsersEntity,
  UserStatus,
} from '@san-martin/san-martin-libs';
import { NextFunction, Request, Response } from 'express';

import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    try {
      if (authHeader && (authHeader as string).split(' ')[1]) {
        const token = (authHeader as string).split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.appConfigService.jwtSecret,
        });

        if (payload.user === 'guest') {
          const role = await this.roleService.findById(payload.roleId);

          const userData = {
            firstName: 'guest',
            role: role,
          };

          req.user = userData as UsersEntity;

          next();
        } else {
          const user = await this.userService.findOneByIdForAuth(payload.sub);

          if (!user) {
            throw new UnauthorizedException();
          }

          const {
            headers: { platform: type },
          } = req;

          const platform = type as Platform;

          const rolePermissionPlatform = {
            [Platform.AdminPanel]: user.role.adminPanelAccess,
            [Platform.OperatorApp]: user.role.operatorAppAccess,
            [Platform.CustomerApp]: user.role.customerAppAccess,
          };

          if (!rolePermissionPlatform[platform]) {
            throw new OperationError(ErrorMessageEnum.USER_PLATFORM_ERROR, HttpStatus.BAD_REQUEST);
          }

          if (user.status === UserStatus.BLOCKED) {
            throw new UnauthorizedException();
          }

          if (!user.isOnline) {
            throw new UnauthorizedException();
          }

          req.user = user;

          next();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
