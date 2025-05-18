import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ default: 'Nha Trang' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;
}

export class UpdateCityDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;

  @ApiProperty({ default: 'Nha Trang' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  province_id?: number;
}

export class DeleteCityDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;
}

export class GetCityDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;
}

export class QueryCityDto {
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

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  province_id?: number;
}
