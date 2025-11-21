import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, Role } from '@/common/enums';
import {
  User,
  UserProfile,
  ContactInfo,
  Education,
  UsersFamily,
  ReligionInfo,
  Patrika,
  UserPreferences,
  ProfileVisited,
  UserBlockedProfile,
} from '@/common/database/entities';

type Subjects =
  | InferSubjects<
      | typeof User
      | typeof UserProfile
      | typeof ContactInfo
      | typeof Education
      | typeof UsersFamily
      | typeof ReligionInfo
      | typeof Patrika
      | typeof UserPreferences
      | typeof ProfileVisited
      | typeof UserBlockedProfile
    >
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.role === Role.SUPERADMIN) {
      // Superadmin can manage everything
      can(Action.MANAGE, 'all');
    } else if (user.role === Role.SUPERVISOR) {
      // Supervisor permissions
      // Can read all profiles
      can(Action.READ, [
        User,
        UserProfile,
        ContactInfo,
        Education,
        UsersFamily,
        ReligionInfo,
        Patrika,
        UserPreferences,
      ]);

      // Can manage reported/blocked profiles
      can(Action.MANAGE, [ProfileVisited, UserBlockedProfile]);

      // Can update moderation-related fields
      can(Action.UPDATE, User, ['isVerified', 'isActive']);
      can(Action.UPDATE, UserProfile);

      // Cannot delete users or sensitive data
      cannot(Action.DELETE, User);
      cannot(Action.DELETE, ContactInfo);
    } else if (user.role === Role.APPLICATION_USER) {
      // Application User permissions
      // Can read their own data
      can(Action.READ, User, { id: user.id });
      can(Action.READ, UserProfile, { userId: user.id });
      can(Action.READ, ContactInfo, { userId: user.id });
      can(Action.READ, Education, { userId: user.id });
      can(Action.READ, UsersFamily, { userId: user.id });
      can(Action.READ, ReligionInfo, { userId: user.id });
      can(Action.READ, Patrika, { userId: user.id });
      can(Action.READ, UserPreferences, { userId: user.id });
      can(Action.READ, ProfileVisited, { visitorId: user.id });
      can(Action.READ, UserBlockedProfile, { blockerId: user.id });

      // Can update their own profile
      can(Action.UPDATE, User, { id: user.id });
      can(Action.UPDATE, UserProfile, { userId: user.id });
      can(Action.UPDATE, ContactInfo, { userId: user.id });
      can(Action.UPDATE, Education, { userId: user.id });
      can(Action.UPDATE, UsersFamily, { userId: user.id });
      can(Action.UPDATE, ReligionInfo, { userId: user.id });
      can(Action.UPDATE, Patrika, { userId: user.id });
      can(Action.UPDATE, UserPreferences, { userId: user.id });

      // Can create their own profile data
      can(Action.CREATE, [
        UserProfile,
        ContactInfo,
        Education,
        UsersFamily,
        ReligionInfo,
        Patrika,
        UserPreferences,
        ProfileVisited,
        UserBlockedProfile,
      ]);

      // Can delete their own education and family entries
      can(Action.DELETE, Education, { userId: user.id });
      can(Action.DELETE, UsersFamily, { userId: user.id });

      // Can read other users' public profiles
      can(Action.READ, UserProfile);
      can(Action.READ, ReligionInfo);
      can(Action.READ, Education);
      can(Action.READ, UsersFamily);

      // Cannot read sensitive contact info of others
      cannot(Action.READ, ContactInfo, { userId: { $ne: user.id } });
      cannot(Action.READ, Patrika, { userId: { $ne: user.id } });
      cannot(Action.READ, UserPreferences, { userId: { $ne: user.id } });

      // Cannot modify other users' data
      cannot(Action.UPDATE, User, { id: { $ne: user.id } });
      cannot(Action.UPDATE, UserProfile, { userId: { $ne: user.id } });
      cannot(Action.DELETE, User);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
