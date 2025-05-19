import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category slug' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category slug' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeleteCategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}

export class GetCategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}

export class QueryCategoryDto {
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

export class CreateIfNotExistsCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
