import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('patrika')
export class Patrika extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rashi: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nakshatra: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  charan: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gan: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nadi: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mangal: string;

  @ManyToOne(() => User, (user) => user.patrika)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
