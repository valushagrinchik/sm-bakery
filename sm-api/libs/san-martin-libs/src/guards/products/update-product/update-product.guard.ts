import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { iRequest } from '@san-martin/san-martin-libs';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateProductGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: iRequest = context.switchToHttp().getRequest();
    const { user } = request;
    return !!user.role.permission.updateProduct;
  }
}
