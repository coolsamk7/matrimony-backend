import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/common/database/entities';

/**
 * Custom parameter decorator to extract the authenticated user from the request
 * Use this instead of @Req() req and accessing req.user
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @Protected((ability) => ability.can(Action.READ, User))
 * async getProfile(@AuthenticatedUser() user: User) {
 *   return user;
 * }
 * ```
 *
 * @example Get specific user property
 * ```typescript
 * @Get('my-posts')
 * async getMyPosts(@AuthenticatedUser('id') userId: string) {
 *   return this.postsService.findByUserId(userId);
 * }
 * ```
 */
export const AuthenticatedUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
