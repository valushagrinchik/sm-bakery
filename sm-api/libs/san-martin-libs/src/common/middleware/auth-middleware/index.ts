import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { AppConfigService } from '../../../app-config/app-config.service';

/**
 * AuthMiddleware
 *
 * Note: This middleware is currently not used for authorization.
 * It has been disabled and may be re-enabled in the future to handle requests related to authentication and authorization.
 *
 * If you need to restore its functionality, ensure it is correctly integrated into the routing chains and aligns with the current authorization logic.
 */

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    try {
      if (authHeader && (authHeader as string).split(' ')[1]) {
        const token = (authHeader as string).split(' ')[1];
        const decode = await this.jwtService.verifyAsync(token, {
          secret: this.appConfigService.jwtSecret,
        });

        console.log(decode);

        //TODO: Check JWT token logic

        next();
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
