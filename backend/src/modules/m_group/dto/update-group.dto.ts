import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cover_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  plan_id?: number;

  @ApiProperty({
    required: false,
    description: 'JSON data containing location and other metadata',
  })
  @IsOptional()
  @IsObject()
  json_data?: any;
}
