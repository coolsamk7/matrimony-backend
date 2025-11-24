import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatrikaDto {
  @ApiProperty({
    description: 'Rashi (Moon sign)',
    example: 'Mesh (Aries)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  rashi?: string;

  @ApiProperty({
    description: 'Nakshatra (Birth star)',
    example: 'Ashwini',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nakshatra?: string;

  @ApiProperty({
    description: 'Charan (Quarter)',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  charan?: string;

  @ApiProperty({
    description: 'Gan (Temperament)',
    example: 'Dev',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gan?: string;

  @ApiProperty({
    description: 'Nadi',
    example: 'Aadi',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nadi?: string;

  @ApiProperty({
    description: 'Mangal Dosha status',
    example: 'No',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mangal?: string;
}
