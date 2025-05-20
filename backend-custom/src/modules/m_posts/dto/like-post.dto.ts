import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikePostDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  postId: number;

  @ApiProperty({ default: 1 })
  reactionId?: number;
}
