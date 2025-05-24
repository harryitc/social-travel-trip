import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetMessagesDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  @IsNumber()
  limit?: number = 50;

  @ApiProperty({
    required: false,
    description: 'Get messages before this message ID (for load more older messages)',
  })
  @IsOptional()
  @IsNumber()
  before_id?: number;
}
