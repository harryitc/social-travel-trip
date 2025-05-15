import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikePostDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example postId' })
  postId: string;

  @ApiProperty({ example: 'Example reactionId' })
  reactionId?: number;
}
