import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username_or_email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  role?: string; // 'member' | 'moderator'

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}
