import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMiniBlogDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;

  @IsOptional()
  @ApiProperty({ default: 'Example title' })
  title?: string;

  @IsOptional()
  @ApiProperty({ default: 'example-slug' })
  slug?: string;

  @IsOptional()
  @ApiProperty({ default: 'Example description' })
  description?: string;

  @IsOptional()
  @ApiProperty({ default: '2023-01-01' })
  dayTravel?: string;

  @IsOptional()
  @ApiProperty({ default: {} })
  location?: any;

  @IsOptional()
  @ApiProperty({ default: 'https://example.com/image.jpg' })
  thumbnailUrl?: string;

  @IsOptional()
  @ApiProperty({ default: {} })
  jsonData?: any;
}
