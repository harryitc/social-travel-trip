import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';

export class LocationDTO {
  @ApiProperty({ example: 10.762622 })
  lat?: number;

  @ApiProperty({ example: 106.660172 })
  lon?: number;

  @ApiProperty({ example: 'Ho Chi Minh City' })
  name?: string;

  @ApiProperty({ example: 'The largest city in Vietnam' })
  description?: string;
}

export class CreatePostDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 'Example content' })
  content: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: ['user1', 'user2'],
    description: 'List of users mentioned in the post',
    required: false,
  })
  mentions?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: ['travel', 'vietnam'],
    description: 'List of hashtags used in the post',
    required: false,
  })
  hashtags?: string[];

  @IsOptional()
  @IsObject()
  @ApiProperty({
    type: LocationDTO,
    description: 'Location information for the post',
    required: false,
  })
  location?: LocationDTO;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'List of image URLs',
    required: false,
  })
  images?: string[];

  @ApiProperty({
    default: {},
    description: 'Additional JSON data for the post',
    required: false,
  })
  jsonData?: any;
}
