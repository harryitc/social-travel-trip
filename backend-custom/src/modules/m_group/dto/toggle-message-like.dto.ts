import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ToggleMessageLikeDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_message_id: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  reaction_id: number = 1;
}
