import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  postId: number;

  @ApiProperty({ default: 1 })
  parentId: number | null;

  @IsNotEmpty()
  @ApiProperty({ default: 'Example content' })
  content: string;

  @ApiProperty({ default: {} })
  jsonData?: any;
}
