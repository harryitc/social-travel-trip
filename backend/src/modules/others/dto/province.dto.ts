import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty({ description: 'Province name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateProvinceDto {
  @ApiProperty({ description: 'Province ID' })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;

  @ApiProperty({ description: 'Province name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class DeleteProvinceDto {
  @ApiProperty({ description: 'Province ID' })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;
}

export class GetProvinceDto {
  @ApiProperty({ description: 'Province ID' })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;
}

export class QueryProvinceDto {
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
