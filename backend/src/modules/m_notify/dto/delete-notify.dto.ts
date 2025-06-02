import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteNotifyDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  notify_id: number;
}
