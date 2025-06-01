import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowUserDto {
  @ApiProperty({ description: 'ID of the user to follow' })
  @IsNotEmpty()
  @IsNumber()
  following_id: number;
}
