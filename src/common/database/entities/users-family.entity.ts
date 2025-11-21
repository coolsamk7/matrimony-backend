import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { MaritalStatus } from '@common/enums';

@Entity('users_family')
export class UsersFamily extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  occupation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relation: string;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    name: 'marital_status',
    nullable: true,
  })
  maritalStatus: MaritalStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, name: 'whats_app', nullable: true })
  whatsApp: string;

  @ManyToOne(() => User, (user) => user.family)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
