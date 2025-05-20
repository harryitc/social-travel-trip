import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

export class UpdatePlanBasicDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;

  @ApiProperty({
    description: 'Name of the plan',
    example: 'Trip to Da Nang',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'A 3-day trip to Da Nang with family',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Location information (name, description, lat, lon)',
    example: {
      name: 'Da Nang',
      description: 'Coastal city in central Vietnam',
      lat: 16.0544,
      lon: 108.2022,
    },
  })
  @IsOptional()
  @IsObject()
  location?: any;

  @ApiProperty({
    description: 'Thumbnail URL for the plan',
    example: 'https://example.com/images/danang.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiProperty({
    description: 'Status of the plan (public or private)',
    example: 'public',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
