import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHashtagDto {
  @ApiProperty({ default: 'travel' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'travel' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateHashtagDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;

  @ApiProperty({ default: 'travel' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'travel' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeleteHashtagDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}

export class GetHashtagDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}

export class QueryHashtagDto {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateIfNotExistsHashtagDto {
  @ApiProperty({ default: 'travel' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
