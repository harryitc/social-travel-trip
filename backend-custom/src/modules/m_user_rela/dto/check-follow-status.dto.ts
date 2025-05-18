import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckFollowStatusDto {
  @ApiProperty({ description: 'ID of the user to check follow status for' })
  @IsNotEmpty()
  @IsNumber()
  following_id: number;
}
