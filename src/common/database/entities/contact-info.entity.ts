import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('contact_info')
export class ContactInfo extends BaseEntity {
  @Column({ type: 'varchar', length: 26, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255, name: 'work_city', nullable: true })
  workCity: string;

  @Column({ type: 'varchar', length: 255, name: 'family_city', nullable: true })
  familyCity: string;

  @Column({ type: 'varchar', length: 255, name: 'current_city', nullable: true })
  currentCity: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @ManyToOne(() => User, (user) => user.contactInfo)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
