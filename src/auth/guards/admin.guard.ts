import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticatedUser,
  AuthenticatedAdmin,
  JwtPayload,
} from '../../common/types/auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser | AuthenticatedAdmin = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Extract and decode JWT token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Invalid authorization header');
    }

    const token = authHeader.slice(7);
    let jwtPayload: JwtPayload;

    try {
      jwtPayload = this.jwtService.decode(token) as JwtPayload;
    } catch {
      throw new ForbiddenException('Invalid token');
    }

    // Check if the token type is admin
    if (!jwtPayload || jwtPayload.type !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    // Double check that user ID is a string (AdminUser has UUID string id, Player has number id)
    const isAdmin = typeof user.id === 'string' && jwtPayload.type === 'admin';

    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
