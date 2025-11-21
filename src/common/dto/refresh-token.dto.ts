import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token to generate new access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUhSWlZHTjJNWENGVDU5WkYxQkhSRDFGUCIsInVzZXJuYW1lIjoiam9obl9kb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6IkFQUExJQ0FUSU9OX1VTRVIiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwNjA0ODAwfQ.example',
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
