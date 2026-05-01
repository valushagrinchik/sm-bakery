import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const UsersRequest = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
