import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Platform } from '@san-martin/san-martin-libs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdmitPanelGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    return headers['platform'] === Platform.AdminPanel;
  }
}
