import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateJoinQRCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expiration_time?: string; // ISO string format for expiration time, e.g. '2023-12-31T23:59:59Z'
}
