import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser, AuthenticatedAdmin } from '../../common/types/auth.types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser | AuthenticatedAdmin => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);