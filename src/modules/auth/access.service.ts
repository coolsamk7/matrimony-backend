import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { User } from '@/common/database/entities';
import { JwtPayload } from '@/common/strategies';

@Injectable()
export class AccessService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate access token for a user
   */
  generateAccessToken(user: User): string {
    const accessTokenExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m') || '15m';

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: accessTokenExpiry as StringValue,
    });
  }

  /**
   * Generate refresh token for a user
   */
  generateRefreshToken(user: User): string {
    const refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY', '7d') || '7d';

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiry as StringValue,
    });
  }

  /**
   * Verify and decode refresh token
   */
  verifyRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Get access token expiry in seconds
   */
  getAccessTokenExpirySeconds(): number {
    const expiry = this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m');
    // Convert to seconds - default 15 minutes = 900 seconds
    return this.parseExpiryToSeconds(expiry || '15m');
  }

  /**
   * Get refresh token expiry in seconds
   */
  getRefreshTokenExpirySeconds(): number {
    const expiry = this.configService.get<string>('JWT_REFRESH_EXPIRY', '7d');
    // Convert to seconds - default 7 days = 604800 seconds
    return this.parseExpiryToSeconds(expiry || '7d');
  }

  /**
   * Calculate expiry date from now
   */
  calculateExpiryDate(expiryString: string): Date {
    const seconds = this.parseExpiryToSeconds(expiryString);
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + seconds);
    return expiresAt;
  }

  /**
   * Parse expiry string to seconds
   * Supports formats like: 15m, 7d, 1h, 30s
   */
  private parseExpiryToSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 900; // Default to 15 minutes
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 900;
    }
  }
}
