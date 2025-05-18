import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarkReadNotifyDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  notify_id: number;
}
