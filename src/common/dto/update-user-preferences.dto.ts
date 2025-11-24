import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Complexion } from '@/common/enums';

export class UpdateUserPreferencesDto {
  @ApiProperty({
    description: 'Minimum age preference',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  ageRangeFrom?: number;

  @ApiProperty({
    description: 'Maximum age preference',
    example: 35,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  ageRangeTo?: number;

  @ApiProperty({
    description: 'Preferred complexion',
    enum: Complexion,
    required: false,
  })
  @IsOptional()
  @IsEnum(Complexion)
  complexion?: Complexion;

  @ApiProperty({
    description: 'Preferred education level',
    example: 'Graduate',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  education?: string;

  @ApiProperty({
    description: 'Preferred occupation',
    example: 'Software Engineer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  occupation?: string;

  @ApiProperty({
    description: 'Preferred income range',
    example: '10-15 LPA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  income?: string;

  @ApiProperty({
    description: 'Preferred employment sector',
    example: 'Private',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  employedIn?: string;

  @ApiProperty({
    description: 'Preferred caste',
    example: 'Maratha',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  caste?: string;

  @ApiProperty({
    description: 'Preferred subcaste',
    example: '96 Kuli Maratha',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subCaste?: string;

  @ApiProperty({
    description: 'Preferred gotra',
    example: 'Kashyap',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gotra?: string;

  @ApiProperty({
    description: 'Preferred marital status',
    example: 'Never Married',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  maritalStatus?: string;

  @ApiProperty({
    description: 'Manglik preference',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  manglik?: boolean;

  @ApiProperty({
    description: 'Patrika matching preference',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  patrikPreference?: boolean;
}
