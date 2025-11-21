import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ulid } from 'ulid';
import { User, RefreshToken } from '@/common/database/entities';
import { Role } from '@/common/enums';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
  RequestOtpDto,
  CompleteRegistrationDto,
} from '@/common/dto';
import { AccessService } from './access.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private accessService: AccessService,
    private otpService: OtpService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, mobile, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }, { mobile }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.mobile === mobile) {
        throw new ConflictException('Mobile number already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      id: ulid(),
      username,
      email,
      mobile,
      password: hashedPassword,
      role: Role.APPLICATION_USER,
    });

    await this.userRepository.save(user);

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { emailOrUsername, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    // Verify refresh token
    let payload;
    try {
      payload = this.accessService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token type is refresh
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Check if refresh token exists and is not revoked
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found or revoked');
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Get user
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke old refresh token
    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    // Generate new tokens
    return this.generateAuthResponse(user);
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (storedToken) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);
    }
  }

  async revokeAllTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update({ userId, isRevoked: false }, { isRevoked: true });
  }

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    // Generate access token
    const accessToken = this.accessService.generateAccessToken(user);

    // Generate refresh token
    const refreshToken = this.accessService.generateRefreshToken(user);

    // Calculate expiry date for refresh token
    const refreshTokenExpiry = this.accessService.getRefreshTokenExpirySeconds();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiry);

    // Store refresh token
    const refreshTokenEntity = this.refreshTokenRepository.create({
      id: ulid(),
      userId: user.id,
      token: refreshToken,
      expiresAt,
      isRevoked: false,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessService.getAccessTokenExpirySeconds(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * NEW REGISTRATION FLOW WITH OTP (2-STEP)
   */

  /**
   * Step 1: Request OTP - Send OTP to mobile number
   */
  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    const { mobile } = requestOtpDto;

    // Check if mobile already registered
    const existingUser = await this.userRepository.findOne({ where: { mobile } });
    if (existingUser) {
      throw new ConflictException('Mobile number already registered');
    }

    // Send OTP via third-party service
    const otpResult = await this.otpService.sendOtp(mobile);

    if (!otpResult.success) {
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }

    return {
      message: 'OTP sent successfully to your mobile number',
    };
  }

  /**
   * Step 2: Verify OTP and Complete Registration - All in one step
   */
  async completeRegistration(completeRegDto: CompleteRegistrationDto): Promise<AuthResponseDto> {
    const { mobile, otp, username, password, email, dateOfBirth, gender } = completeRegDto;

    // Verify OTP with third-party service
    const verificationResult = await this.otpService.verifyOtp(mobile, otp);

    if (!verificationResult.success) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Check if mobile already registered
    const existingMobile = await this.userRepository.findOne({ where: { mobile } });
    if (existingMobile) {
      throw new ConflictException('Mobile number already registered');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check email if provided
    if (email) {
      const existingEmail = await this.userRepository.findOne({ where: { email } });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all data
    const user = this.userRepository.create({
      id: ulid(),
      username,
      email,
      mobile,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      role: Role.APPLICATION_USER,
      isMobileVerified: true,
      isEmailVerified: false,
      isProfileComplete: false, // User needs to complete profile details later
    });

    await this.userRepository.save(user);

    // Generate tokens and return
    return this.generateAuthResponse(user);
  }
}
