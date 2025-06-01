import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class RespondInvitationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  invitation_id: number;

  @ApiProperty({ enum: ['accepted', 'declined'] })
  @IsNotEmpty()
  @IsEnum(['accepted', 'declined'])
  response: 'accepted' | 'declined';
}
