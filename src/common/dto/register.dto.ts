import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Mobile number of the user',
    example: '+919876543210',
    pattern: '^\\+?[1-9]\\d{1,14}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid mobile number with country code',
  })
  mobile: string;

  @ApiProperty({
    description:
      'Password for the account (min 8 characters, must include uppercase, lowercase, number, and special character)',
    example: 'SecurePass@123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
