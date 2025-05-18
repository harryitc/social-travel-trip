import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ default: 'Ẩm thực' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'am-thuc' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ default: 'Ẩm thực' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'am-thuc' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeleteCategoryDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}

export class GetCategoryDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}

export class QueryCategoryDto {
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

export class CreateIfNotExistsCategoryDto {
  @ApiProperty({ default: 'Ẩm thực' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
