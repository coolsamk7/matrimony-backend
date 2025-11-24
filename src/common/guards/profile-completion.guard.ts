import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators';

/**
 * Profile Completion Guard
 * Ensures users have completed their profile before accessing protected features
 * Skips check for public routes and specific endpoints
 */
@Injectable()
export class ProfileCompletionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // No user means authentication failed, let AuthGuard handle it
    if (!user) {
      return true;
    }

    // Skip profile completion check for specific endpoints
    const exemptPaths = [
      '/auth/complete-registration',
      '/auth/profile',
      '/auth/logout',
      '/auth/refresh',
      '/auth/revoke-all',
      '/profile/', // Allow all profile endpoints for profile completion
    ];

    const path = request.route?.path || request.url;
    if (exemptPaths.some((exemptPath) => path.includes(exemptPath))) {
      return true;
    }

    // Check if profile is complete
    if (!user.isProfileComplete) {
      throw new ForbiddenException(
        'Please complete your profile to access this feature. Complete all profile sections: basic info, contact info, education, religion info, and family.',
      );
    }

    return true;
  }
}
