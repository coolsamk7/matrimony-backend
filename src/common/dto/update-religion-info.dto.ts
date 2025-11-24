import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReligionInfoDto {
  @ApiProperty({
    description: 'Religion',
    example: 'Hindu',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  religion?: string;

  @ApiProperty({
    description: 'Caste',
    example: 'Maratha',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  caste?: string;

  @ApiProperty({
    description: 'Subcaste',
    example: '96 Kuli Maratha',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subcaste?: string;

  @ApiProperty({
    description: 'Gotra',
    example: 'Kashyap',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gotra?: string;
}
