import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Complexion } from '@common/enums';

@Entity('user_preferences')
export class UserPreferences extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'int', name: 'age_range_from', nullable: true })
  ageRangeFrom: number;

  @Column({ type: 'int', name: 'age_range_to', nullable: true })
  ageRangeTo: number;

  @Column({
    type: 'enum',
    enum: Complexion,
    nullable: true,
  })
  complexion: Complexion;

  @Column({ type: 'varchar', length: 255, nullable: true })
  education: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  occupation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  income: string;

  @Column({ type: 'varchar', length: 100, name: 'employed_in', nullable: true })
  employedIn: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  caste: string;

  @Column({ type: 'varchar', length: 100, name: 'sub_caste', nullable: true })
  subCaste: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gotra: string;

  @Column({ type: 'varchar', length: 50, name: 'marital_status', nullable: true })
  maritalStatus: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  manglik: boolean;

  @Column({ type: 'boolean', name: 'patrik_preference', nullable: true, default: false })
  patrikPreference: boolean;

  @ManyToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
