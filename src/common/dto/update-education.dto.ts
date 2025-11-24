import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEducationDto {
  @ApiProperty({
    description: 'Medium of education',
    example: 'English',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  medium?: string;

  @ApiProperty({
    description: 'Highest degree',
    example: 'Bachelor of Engineering',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  degree?: string;

  @ApiProperty({
    description: 'Institution name',
    example: 'MIT',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Stream/Specialization',
    example: 'Computer Science',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  stream?: string;

  @ApiProperty({
    description: 'Professional certifications (comma-separated)',
    example: 'AWS Certified, Google Cloud Professional',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  certifications?: string;

  @ApiProperty({
    description: 'University or college name',
    example: 'University of Mumbai',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  universityOrCollege?: string;
}
