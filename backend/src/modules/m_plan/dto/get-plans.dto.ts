import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class GetPlansDTO {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: 'Status filter (public or private)',
    example: 'public',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Search term for name_khong_dau',
    example: 'da nang',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Tags to filter by',
    example: ['beach', 'mountains'],
  })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
