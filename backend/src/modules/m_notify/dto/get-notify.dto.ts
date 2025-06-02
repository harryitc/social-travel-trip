import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetNotifyDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  notify_id: number;
}
