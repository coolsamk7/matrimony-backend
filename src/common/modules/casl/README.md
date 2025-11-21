# CASL Authorization Module

## Overview
This module implements role-based authorization using CASL (Code Access Security Library) with three distinct roles.

## Roles

### 1. APPLICATION_USER (Default)
Regular users of the matrimony platform.

**Permissions:**
- ✅ Read and update their own profile data (User, UserProfile, ContactInfo, Education, UsersFamily, ReligionInfo, Patrika, UserPreferences)
- ✅ Create their own profile-related records
- ✅ Read other users' public profiles (UserProfile, ReligionInfo, Education, UsersFamily)
- ✅ Create ProfileVisited and UserBlockedProfile records
- ✅ Delete their own Education and UsersFamily entries
- ❌ Cannot read others' private data (ContactInfo, Patrika, UserPreferences)
- ❌ Cannot modify other users' data
- ❌ Cannot delete User records

### 2. SUPERVISOR
Moderators who can oversee content and user activity.

**Permissions:**
- ✅ All APPLICATION_USER permissions
- ✅ Read all user profiles and data
- ✅ Manage ProfileVisited and UserBlockedProfile records
- ✅ Update user verification status (isVerified, isActive fields)
- ✅ Update UserProfile information
- ❌ Cannot delete users or sensitive contact information

### 3. SUPERADMIN
System administrators with full access.

**Permissions:**
- ✅ Manage all resources (full CRUD on all entities)
- ✅ No restrictions

## Usage

### 1. Import CaslModule
```typescript
import { CaslModule } from '@/common/modules/casl';

@Module({
  imports: [CaslModule],
  // ...
})
export class YourModule {}
```

### 2. Use @CheckPolicies Decorator
```typescript
import { CheckPolicies } from '@/common/modules/casl';
import { Action } from '@/common/enums';
import { UserProfile } from '@/common/database/entities';

@Controller('profiles')
export class ProfilesController {
  // Check if user can read UserProfile
  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, UserProfile))
  findAll() {
    // ...
  }

  // Check if user can update a specific profile
  @Put(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, UserProfile))
  update(@Param('id') id: string, @Body() updateDto: UpdateProfileDto) {
    // ...
  }
}
```

### 3. Apply PoliciesGuard
Apply globally in main.ts:
```typescript
import { Reflector } from '@nestjs/core';
import { PoliciesGuard } from '@/common/modules/casl';

const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new PoliciesGuard(app.get(Reflector), app.get(CaslAbilityFactory)));
```

Or per-controller/route:
```typescript
@Controller('admin')
@UseGuards(PoliciesGuard)
export class AdminController {
  // ...
}
```

### 4. Check Permissions Programmatically
```typescript
import { CaslAbilityFactory } from '@/common/modules/casl';
import { Action } from '@/common/enums';

@Injectable()
export class SomeService {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  async doSomething(user: User, profile: UserProfile) {
    const ability = this.caslAbilityFactory.createForUser(user);
    
    if (ability.can(Action.UPDATE, profile)) {
      // User can update this profile
    } else {
      throw new ForbiddenException();
    }
  }
}
```

## Actions
```typescript
enum Action {
  MANAGE = 'manage',  // Special action that represents any action
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}
```

## Subjects
All entities are supported as subjects:
- User
- UserProfile
- ContactInfo
- Education
- UsersFamily
- ReligionInfo
- Patrika
- UserPreferences
- ProfileVisited
- UserBlockedProfile
- 'all' (special subject for manage action)

## Installation
The required package is already installed:
```bash
yarn add @casl/ability
```

## Next Steps
1. Run `yarn install` to install @casl/ability
2. Import CaslModule in AppModule
3. Implement authentication to populate request.user
4. Apply PoliciesGuard where needed
5. Use @CheckPolicies decorator on protected routes
