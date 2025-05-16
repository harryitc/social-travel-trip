import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  postId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Example content' })
  content: string;

  @ApiProperty({ example: 'Example jsonData' })
  jsonData?: any;

  @IsNotEmpty()
  @ApiProperty({ example: '2' })
  parentId: string;
}
