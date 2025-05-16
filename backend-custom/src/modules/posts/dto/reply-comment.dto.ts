import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example postId' })
  postId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Example content' })
  content: string;

  @ApiProperty({ example: 'Example jsonData' })
  jsonData?: any;

  @IsNotEmpty()
  @ApiProperty({ example: 'Example parentId' })
  parentId: string;
}
