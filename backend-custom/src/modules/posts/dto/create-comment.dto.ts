import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example postId' })
  postId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Example content' })
  content: string;

  @ApiProperty({ example: 'Example jsonData' })
  jsonData?: any;
}
