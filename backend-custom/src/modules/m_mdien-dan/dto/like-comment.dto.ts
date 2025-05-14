import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikeCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example commentId' })
  commentId: string;

  @ApiProperty({ example: 'Example reactionId' })
  reactionId?: number;
}
