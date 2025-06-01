import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';

export class ProfileStatsDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 85 })
  @IsNumber()
  completion_percentage: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  profile_views: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  posts_count: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  followers_count: number;

  @ApiProperty({ example: 75 })
  @IsNumber()
  following_count: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  groups_count: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  trips_count: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDate()
  @IsOptional()
  last_active?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDate()
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDate()
  @IsOptional()
  updated_at?: Date;
}

export class UpdateProfileStatsDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 85, required: false })
  @IsNumber()
  @IsOptional()
  completion_percentage?: number;

  @ApiProperty({ example: 150, required: false })
  @IsNumber()
  @IsOptional()
  profile_views?: number;

  @ApiProperty({ example: 25, required: false })
  @IsNumber()
  @IsOptional()
  posts_count?: number;

  @ApiProperty({ example: 50, required: false })
  @IsNumber()
  @IsOptional()
  followers_count?: number;

  @ApiProperty({ example: 75, required: false })
  @IsNumber()
  @IsOptional()
  following_count?: number;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  groups_count?: number;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  trips_count?: number;
}

export class ProfileViewDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  viewer_id: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  profile_owner_id: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDate()
  @IsOptional()
  viewed_at?: Date;
}

export class GetProfileStatsDTO {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  include_activity?: boolean;
}
