import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddGroupMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ required: false })
  nickname?: string;

  @ApiProperty({ default: 'member' })
  role?: string = 'member';
}
