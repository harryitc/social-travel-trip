import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ default: 'Đi bộ đường dài' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'di-bo-duong-dai' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateActivityDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;

  @ApiProperty({ default: 'Đi bộ đường dài' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'di-bo-duong-dai' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeleteActivityDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;
}

export class GetActivityDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;
}

export class QueryActivityDto {
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

export class CreateIfNotExistsActivityDto {
  @ApiProperty({ default: 'Đi bộ đường dài' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
