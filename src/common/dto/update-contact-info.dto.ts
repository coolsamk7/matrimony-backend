import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactInfoDto {
  @ApiProperty({
    description: 'Work city',
    example: 'Mumbai',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  workCity?: string;

  @ApiProperty({
    description: 'Family city',
    example: 'Pune',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  familyCity?: string;

  @ApiProperty({
    description: 'Current city',
    example: 'Bangalore',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentCity?: string;

  @ApiProperty({
    description: 'Full address',
    example: '123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
