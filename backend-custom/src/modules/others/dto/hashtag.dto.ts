import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHashtagDto {
  @ApiProperty({ description: 'Hashtag name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Hashtag slug' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateHashtagDto {
  @ApiProperty({ description: 'Hashtag ID' })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;

  @ApiProperty({ description: 'Hashtag name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Hashtag slug' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeleteHashtagDto {
  @ApiProperty({ description: 'Hashtag ID' })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}

export class GetHashtagDto {
  @ApiProperty({ description: 'Hashtag ID' })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}

export class QueryHashtagDto {
  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateIfNotExistsHashtagDto {
  @ApiProperty({ description: 'Hashtag name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
