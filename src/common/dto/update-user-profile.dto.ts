import { IsString, IsOptional, IsInt, IsEnum, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BloodGroup, MaritalStatus, MotherTongue } from '@/common/enums';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Height in centimeters',
    example: 175,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiProperty({
    description: 'Weight in kilograms',
    example: 70,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  weight?: number;

  @ApiProperty({
    description: 'Blood group',
    enum: BloodGroup,
    required: false,
  })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiProperty({
    description: 'Mother tongue',
    enum: MotherTongue,
    required: false,
  })
  @IsOptional()
  @IsEnum(MotherTongue)
  motherTongue?: MotherTongue;

  @ApiProperty({
    description: 'Marital status',
    enum: MaritalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiProperty({
    description: 'About yourself',
    example: 'I am a software engineer with 5 years of experience...',
    required: false,
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    description: 'About family',
    example: 'We are a middle-class family from Mumbai...',
    required: false,
  })
  @IsOptional()
  @IsString()
  aboutFamily?: string;

  @ApiProperty({
    description: 'Profile ID (auto-generated if not provided)',
    example: 'MAT2024001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(26)
  profileId?: string;
}
