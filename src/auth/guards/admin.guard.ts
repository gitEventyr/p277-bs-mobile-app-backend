import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import {
  AuthenticatedUser,
  AuthenticatedAdmin,
} from '../../common/types/auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser | AuthenticatedAdmin = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user has admin role (AdminUser has string id, Player has number id)
    const isAdmin = typeof user.id === 'string';

    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
