import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyPostDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  postId: number;

  @IsNotEmpty()
  @ApiProperty({ default: 'Example content' })
  content: string;

  @ApiProperty({ default: {} })
  jsonData?: any;

  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  parentId: number;
}
