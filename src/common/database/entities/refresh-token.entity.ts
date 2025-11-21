import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/database/entities/base.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ type: 'varchar', length: 26 })
  userId: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;
}
