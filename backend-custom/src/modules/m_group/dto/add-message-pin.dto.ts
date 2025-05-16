import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddMessagePinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_message_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;
}
