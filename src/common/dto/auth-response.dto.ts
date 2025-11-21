import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '01HRZVGN2MXCFT59ZF1BHRD1FP',
  })
  id: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'APPLICATION_USER',
    enum: ['APPLICATION_USER', 'SUPERVISOR', 'SUPERADMIN'],
  })
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for API authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUhSWlZHTjJNWENGVDU5WkYxQkhSRDFGUCIsInVzZXJuYW1lIjoiam9obl9kb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6IkFQUExJQ0FUSU9OX1VTRVIiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDA5MDB9.example',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token for obtaining new access tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUhSWlZHTjJNWENGVDU5WkYxQkhSRDFGUCIsInVzZXJuYW1lIjoiam9obl9kb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6IkFQUExJQ0FUSU9OX1VTRVIiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwNjA0ODAwfQ.example',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 900,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
