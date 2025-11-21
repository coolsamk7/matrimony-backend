import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({ example: 'ok', description: 'Health status of the application' })
  status: string;

  @ApiProperty({ example: '2025-11-21T12:00:00.000Z', description: 'Current timestamp' })
  timestamp: string;
}
