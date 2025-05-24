import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: 'Group name', example: 'Khám phá Đà Lạt' })
  @IsNotEmpty({ message: 'Group name is required' })
  @IsString({ message: 'Group name must be a string' })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Group description',
    example: 'Chuyến đi khám phá thành phố ngàn hoa',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ required: false, description: 'Cover image URL' })
  @IsOptional()
  @IsString({ message: 'Cover URL must be a string' })
  cover_url?: string;

  @ApiProperty({ required: false, description: 'Associated plan ID' })
  @IsOptional()
  @IsNumber({}, { message: 'Plan ID must be a number' })
  plan_id?: number;

  @ApiProperty({
    required: false,
    description: 'Group status',
    enum: ['public', 'private'],
    default: 'private',
    example: 'private',
  })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['public', 'private'], {
    message: 'Status must be either public or private',
  })
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Additional group data including location',
    example: { location: 'Đà Lạt, Lâm Đồng' },
  })
  @IsOptional()
  @IsObject({ message: 'JSON data must be an object' })
  json_data?: any;
}
