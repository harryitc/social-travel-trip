import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetPinnedMessagesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;
}
