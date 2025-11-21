import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  RequestOtpDto,
  CompleteRegistrationDto,
} from '@/common/dto';
import { Public, Protected, AuthenticatedUser } from '@/common/decorators';
import { Action } from '@/common/enums';
import { User } from '@/common/database/entities';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email, username, or mobile already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email/username and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token successfully refreshed',
    type: AuthResponseDto,
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and revoke refresh token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully logged out' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ message: string }> {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return { message: 'Successfully logged out' };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Post('revoke-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all refresh tokens for the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All tokens successfully revoked' })
  async revokeAll(@AuthenticatedUser('id') userId: string): Promise<{ message: string }> {
    await this.authService.revokeAllTokens(userId);
    return { message: 'All tokens revoked successfully' };
  }

  @Protected((ability) => ability.can(Action.READ, User))
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User profile retrieved successfully' })
  async getProfile(@AuthenticatedUser() user: User) {
    return user;
  }

  // NEW OTP-BASED REGISTRATION ENDPOINTS (2-STEP FLOW)

  @Public()
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 1: Request OTP for registration',
    description: 'Send OTP to mobile number for verification.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'OTP sent successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Mobile already registered' })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    return this.authService.requestOtp(requestOtpDto);
  }

  @Public()
  @Post('complete-registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Step 2: Verify OTP and complete registration',
    description:
      'Verify OTP and complete registration with all user details (mobile, OTP, username, password, email, DOB, gender).',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration completed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired OTP',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username, email, or mobile already exists',
  })
  async completeRegistration(
    @Body() completeRegDto: CompleteRegistrationDto,
  ): Promise<AuthResponseDto> {
    return this.authService.completeRegistration(completeRegDto);
  }
}
