import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_blocked_profile')
export class UserBlockedProfile extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 26, name: 'block_profile_id' })
  blockProfileId: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @ManyToOne(() => User, (user) => user.blockedProfiles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.blockedByProfiles)
  @JoinColumn({ name: 'block_profile_id' })
  blockedProfile: User;
}
