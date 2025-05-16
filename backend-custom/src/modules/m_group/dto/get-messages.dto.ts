import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetMessagesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Get messages before this message ID (for load more)' })
  @IsOptional()
  @IsNumber()
  before_id?: number;
}
