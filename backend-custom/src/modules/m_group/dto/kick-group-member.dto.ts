import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class KickGroupMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
