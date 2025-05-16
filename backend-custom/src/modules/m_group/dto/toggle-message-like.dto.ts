import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ToggleMessageLikeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_message_id: number;
}
