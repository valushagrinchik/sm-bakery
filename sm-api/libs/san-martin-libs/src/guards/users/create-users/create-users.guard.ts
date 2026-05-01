import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { iRequest } from '@san-martin/san-martin-libs/common/types/request';
import { Observable } from 'rxjs';

@Injectable()
export class CreateUsersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: iRequest = context.switchToHttp().getRequest();
    const { user } = request;
    return !!user.role.permission.createUser;
  }
}
