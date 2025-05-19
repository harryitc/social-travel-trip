import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ description: 'Activity name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Activity slug' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;

  @ApiProperty({ description: 'Activity name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Activity slug' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeleteActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;
}

export class GetActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;
}

export class QueryActivityDto {
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

export class CreateIfNotExistsActivityDto {
  @ApiProperty({ description: 'Activity name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
