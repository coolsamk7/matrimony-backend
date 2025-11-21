import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CheckPolicies, PolicyHandler } from '@/common/modules/casl';

/**
 * Combined decorator for protected routes requiring authorization
 * Applies bearer auth, permission check, and standard API responses
 */
export function Protected(...policies: PolicyHandler[]) {
  return applyDecorators(
    ApiBearerAuth(),
    CheckPolicies(...policies),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}
