import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetMessageReactionUsersDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_message_id: number;

  @ApiProperty({ default: 2, required: false })
  @IsOptional()
  @IsNumber()
  reaction_id?: number;
}
