import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('education')
export class Education extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  medium: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  degree: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stream: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  certifications: string;

  @Column({ type: 'varchar', length: 255, name: 'university_or_college', nullable: true })
  universityOrCollege: string;

  @ManyToOne(() => User, (user) => user.education)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
