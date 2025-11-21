import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteRegistrationDto {
  @ApiProperty({
    description: 'Mobile number in international format',
    example: '+919876543210',
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Mobile number must be in valid international format',
  })
  mobile: string;

  @ApiProperty({
    description: 'OTP code received on mobile',
    example: '123456',
  })
  @IsString()
  @MinLength(4, { message: 'OTP must be at least 4 characters' })
  @MaxLength(6, { message: 'OTP cannot exceed 6 characters' })
  otp: string;

  @ApiProperty({
    description: 'Username (3-30 characters, alphanumeric and underscore only)',
    example: 'john_doe123',
  })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    description:
      'Password (minimum 8 characters, must include uppercase, lowercase, number, and special character)',
    example: 'SecurePass@123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Email address (optional)',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'Date of birth in ISO format',
    example: '1995-01-15',
  })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  @IsIn(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  gender: string;
}
