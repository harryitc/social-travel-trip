import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikeCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  commentId: string;

  @ApiProperty({ example: '2' })
  reactionId?: string;
}
