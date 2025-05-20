import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMiniBlogDTO {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 1 })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  userId?: number;
}

export class GetMiniBlogByIdDTO {
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;
}
