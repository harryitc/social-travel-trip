import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ description: 'City name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Province ID' })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;
}

export class UpdateCityDto {
  @ApiProperty({ description: 'City ID' })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;

  @ApiProperty({ description: 'City name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Province ID' })
  @IsOptional()
  @IsNumber()
  province_id?: number;
}

export class DeleteCityDto {
  @ApiProperty({ description: 'City ID' })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;
}

export class GetCityDto {
  @ApiProperty({ description: 'City ID' })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;
}

export class QueryCityDto {
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

  @ApiProperty({ description: 'Province ID', required: false })
  @IsOptional()
  @IsNumber()
  province_id?: number;
}
