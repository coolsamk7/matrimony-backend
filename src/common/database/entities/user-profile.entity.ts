import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { BloodGroup, MaritalStatus, MotherTongue } from '@common/enums';

@Entity('user_profile')
export class UserProfile extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 26, name: 'profile_id', nullable: true })
  profileId: string;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'int', nullable: true })
  weight: number;

  @Column({
    type: 'enum',
    enum: BloodGroup,
    name: 'blood_group',
    nullable: true,
  })
  bloodGroup: BloodGroup;

  @Column({
    type: 'enum',
    enum: MotherTongue,
    name: 'mother_tongue',
    nullable: true,
  })
  motherTongue: MotherTongue;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    name: 'marital_status',
    nullable: true,
  })
  maritalStatus: MaritalStatus;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', name: 'about_family', nullable: true })
  aboutFamily: string;

  @ManyToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
