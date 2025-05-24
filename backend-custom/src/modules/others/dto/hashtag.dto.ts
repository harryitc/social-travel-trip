import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHashtagDto {
  @ApiProperty({ description: 'Hashtag name' })
  @IsNotEmpty()
  @IsString()
  name: string;
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
  @ApiProperty({ description: 'Search term', required: false, default: '' })
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
