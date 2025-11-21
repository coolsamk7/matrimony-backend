# CASL Authorization Integration Guide

## Overview

CASL (Code Access Security Library) has been integrated into the Matrimony Backend to provide robust role-based authorization alongside JWT authentication.

## Architecture

### Global Guards Stack

The application uses a dual-guard system in `main.ts`:

1. **JwtAuthGuard** - Validates JWT tokens and authenticates users
2. **PoliciesGuard** - Checks CASL authorization policies

Both guards are applied globally, ensuring security by default.

## Features Implemented

### 1. Public Routes Decorator

Created `@Public()` decorator to bypass authentication for public endpoints:

```typescript
// src/common/decorators/public.decorator.ts
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Usage:**

```typescript
@Public()
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  // No authentication required
}
```

### 2. Enhanced JwtAuthGuard

The JWT guard now supports the `@Public()` decorator:

```typescript
// src/common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

### 3. Authorization Policies

Use `@CheckPolicies()` decorator to define fine-grained authorization rules:

```typescript
@Get('profile')
@CheckPolicies((ability) => ability.can(Action.READ, User))
async getProfile(@Req() req) {
  return req.user;
}
```

## Authorization Rules

### SUPERADMIN

- Full access to all resources
- Can manage (CRUD) everything

### SUPERVISOR

- Read access to all user data
- Can update user verification status
- Can manage ProfileVisited and UserBlockedProfile
- Cannot delete users or sensitive contact information

### APPLICATION_USER (Default)

- Full access to their own profile data
- Read-only access to other users' public profiles
- Can create profile-related records
- Can block other users
- Cannot modify other users' data

## Auth Controller Integration

### Public Endpoints (No Authentication)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Protected Endpoints (Authentication + Authorization)

- `GET /auth/profile` - Requires `READ` permission on `User` entity
- `POST /auth/revoke-all` - Requires `UPDATE` permission on `User` entity

## How to Use in New Controllers

### Step 1: Import Required Dependencies

```typescript
import { CheckPolicies } from '@/common/modules/casl';
import { Action } from '@/common/enums';
import { YourEntity } from '@/common/database/entities';
import { Public } from '@/common/decorators';
```

### Step 2: Apply Authorization

**For Protected Routes:**

```typescript
@Get()
@CheckPolicies((ability) => ability.can(Action.READ, YourEntity))
async findAll() {
  // Only users with READ permission on YourEntity can access
}
```

**For Public Routes:**

```typescript
@Public()
@Get('public-data')
async getPublicData() {
  // Anyone can access without authentication
}
```

**For Resource-Specific Authorization:**

```typescript
@Put(':id')
@CheckPolicies((ability) => ability.can(Action.UPDATE, YourEntity))
async update(
  @Param('id') id: string,
  @Body() updateDto: UpdateDto,
  @Req() req,
) {
  // Verify the user owns the resource
  const resource = await this.service.findOne(id);
  const ability = this.caslAbilityFactory.createForUser(req.user);

  if (!ability.can(Action.UPDATE, resource)) {
    throw new ForbiddenException('Cannot update this resource');
  }

  return this.service.update(id, updateDto);
}
```

### Step 3: Multiple Policy Checks

```typescript
@Post(':id/special-action')
@CheckPolicies(
  (ability) => ability.can(Action.READ, YourEntity),
  (ability) => ability.can(Action.UPDATE, YourEntity),
)
async specialAction(@Param('id') id: string) {
  // Both READ and UPDATE permissions required
}
```

## Programmatic Permission Checks

Inject `CaslAbilityFactory` in your service:

```typescript
import { CaslAbilityFactory } from '@/common/modules/casl';
import { Action } from '@/common/enums';

@Injectable()
export class YourService {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  async checkPermission(user: User, action: Action, subject: any) {
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!ability.can(action, subject)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}
```

## Testing Authorization

### Test Superadmin Access

```bash
# Login as superadmin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "superadmin@example.com", "password": "password"}'

# Access any protected endpoint
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

### Test Regular User Access

```bash
# Login as regular user
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "user@example.com", "password": "password"}'

# Access own profile (should succeed)
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

### Test Forbidden Access

Try accessing resources the user doesn't have permission for - should return `403 Forbidden`.

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

User is not authenticated (missing or invalid JWT token).

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action"
}
```

User is authenticated but lacks required permissions.

## Best Practices

1. **Default Deny**: All routes are protected by default unless marked with `@Public()`
2. **Least Privilege**: Grant minimum permissions required for each role
3. **Resource Ownership**: Always verify ownership for user-specific resources
4. **Layer Defense**: Use both decorators and programmatic checks for critical operations
5. **Clear Errors**: Provide descriptive error messages for authorization failures

## Migration Notes

### Before CASL Integration

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Req() req) {
  return req.user;
}
```

### After CASL Integration

```typescript
@Get('profile')
@CheckPolicies((ability) => ability.can(Action.READ, User))
async getProfile(@Req() req) {
  return req.user;
}
```

Note: No need to add `@UseGuards(JwtAuthGuard)` as it's now global. Only use it if you need to override the default behavior.

## Configuration

CASL module is imported globally in `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... other imports
    CaslModule,
    AuthModule,
  ],
})
export class AppModule {}
```

Global guards are configured in `main.ts`:

```typescript
const reflector = app.get(Reflector);
const caslAbilityFactory = app.get(CaslAbilityFactory);
app.useGlobalGuards(new JwtAuthGuard(reflector), new PoliciesGuard(reflector, caslAbilityFactory));
```

## Next Steps

1. Create profile management module with CASL authorization
2. Add role-based access for admin endpoints
3. Implement field-level permissions for sensitive data
4. Add audit logging for authorization failures
5. Create custom decorators for common permission patterns

## Troubleshooting

### Issue: All routes return 401

**Solution**: Ensure public routes are marked with `@Public()` decorator.

### Issue: User has access but gets 403

**Solution**: Check CASL ability factory rules in `casl-ability.factory.ts`.

### Issue: TypeScript import errors

**Solution**: Ensure `baseUrl: "./"` is set in `tsconfig.json`.

## References

- [CASL Documentation](https://casl.js.org/v6/en/)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)
