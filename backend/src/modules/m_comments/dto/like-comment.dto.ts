import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikeCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  commentId: number;

  @ApiProperty({ default: 2 })
  reactionId?: number;
}
