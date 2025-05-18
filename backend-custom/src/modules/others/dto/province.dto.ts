import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty({ default: 'Khánh Hòa' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateProvinceDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;

  @ApiProperty({ default: 'Khánh Hòa' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class DeleteProvinceDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;
}

export class GetProvinceDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  province_id: number;
}

export class QueryProvinceDto {
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
