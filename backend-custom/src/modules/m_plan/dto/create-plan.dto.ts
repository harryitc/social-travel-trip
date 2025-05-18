import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsObject, IsArray } from 'class-validator';

export class CreatePlanDTO {
  @ApiProperty({
    description: 'Name of the plan',
    example: 'Trip to Da Nang',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'A 3-day trip to Da Nang with family',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Number of days for the trip',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  days: number;

  @ApiProperty({
    description: 'Location information (name, description, lat, lon)',
    example: {
      name: 'Da Nang',
      description: 'Coastal city in central Vietnam',
      lat: 16.0544,
      lon: 108.2022,
    },
  })
  @IsNotEmpty()
  @IsObject()
  location: any;

  @ApiProperty({
    description: 'Thumbnail URL for the plan',
    example: 'https://example.com/images/danang.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiProperty({
    description: 'Status of the plan (public or private)',
    example: 'private',
    default: 'private',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Additional data in JSON format (tags, etc.)',
    example: {
      name_khong_dau: 'trip to da nang',
      tags: ['beach', 'mountains', 'food'],
    },
  })
  @IsOptional()
  @IsObject()
  json_data?: any;
}
