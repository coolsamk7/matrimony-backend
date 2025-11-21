import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('religion_info')
export class ReligionInfo extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  religion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  caste: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcaste: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gotra: string;

  @ManyToOne(() => User, (user) => user.religionInfo)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
