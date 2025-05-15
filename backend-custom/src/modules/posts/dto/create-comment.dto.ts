import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example postId' })
  postId: string;

  @ApiProperty({ example: 'Example parentId' })
  parentId: string | null;

  @IsNotEmpty()
  @ApiProperty({ example: 'Example content' })
  content: string;

  @ApiProperty({ example: 'Example jsonData' })
  jsonData?: any;
}
