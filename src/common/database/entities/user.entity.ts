import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserProfile } from './user-profile.entity';
import { ContactInfo } from './contact-info.entity';
import { Education } from './education.entity';
import { UsersFamily } from './users-family.entity';
import { ReligionInfo } from './religion-info.entity';
import { Patrika } from './patrika.entity';
import { UserPreferences } from './user-preferences.entity';
import { ProfileVisited } from './profile-visited.entity';
import { UserBlockedProfile } from './user-blocked-profile.entity';
import { Role } from '@/common/enums';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 30, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.APPLICATION_USER,
  })
  role: Role;

  @Column({ default: false })
  isProfileComplete: boolean;

  @Column({ default: false })
  isMobileVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  // Relations
  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToOne(() => ContactInfo, (contact) => contact.user)
  contactInfo: ContactInfo;

  @OneToOne(() => ReligionInfo, (religion) => religion.user)
  religionInfo: ReligionInfo;

  @OneToOne(() => Patrika, (patrika) => patrika.user)
  patrika: Patrika;

  @OneToOne(() => UserPreferences, (preferences) => preferences.user)
  preferences: UserPreferences;

  @OneToMany(() => Education, (education) => education.user)
  education: Education[];

  @OneToMany(() => UsersFamily, (family) => family.user)
  family: UsersFamily[];

  @OneToMany(() => ProfileVisited, (visited) => visited.user)
  profileVisits: ProfileVisited[];

  @OneToMany(() => ProfileVisited, (visited) => visited.profile)
  visitedByProfiles: ProfileVisited[];

  @OneToMany(() => UserBlockedProfile, (blocked) => blocked.user)
  blockedProfiles: UserBlockedProfile[];

  @OneToMany(() => UserBlockedProfile, (blocked) => blocked.blockedProfile)
  blockedByProfiles: UserBlockedProfile[];
}
