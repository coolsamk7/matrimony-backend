import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('profile_visited')
export class ProfileVisited extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 26, name: 'profile_id' })
  profileId: string;

  @Column({ type: 'boolean', name: 'is_contract_viewed', default: false })
  isContractViewed: boolean;

  @Column({ type: 'int', name: 'visit_count', default: 0 })
  visitCount: number;

  @ManyToOne(() => User, (user) => user.profileVisits)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.visitedByProfiles)
  @JoinColumn({ name: 'profile_id' })
  profile: User;
}
