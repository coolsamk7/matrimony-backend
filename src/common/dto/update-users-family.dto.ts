import { IsString, IsOptional, IsEmail, IsEnum, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaritalStatus } from '@/common/enums';

export class UpdateUsersFamilyDto {
  @ApiProperty({
    description: 'Family member occupation',
    example: 'Engineer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  occupation?: string;

  @ApiProperty({
    description: 'Native place',
    example: 'Pune, Maharashtra',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  native?: string;

  @ApiProperty({
    description: 'Relation to user',
    example: 'Father',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  relation?: string;

  @ApiProperty({
    description: 'Marital status',
    enum: MaritalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiProperty({
    description: 'Mobile number',
    example: '+919876543210',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Mobile number must be in valid international format',
  })
  mobile?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'family@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'WhatsApp number',
    example: '+919876543210',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'WhatsApp number must be in valid international format',
  })
  whatsApp?: string;
}
