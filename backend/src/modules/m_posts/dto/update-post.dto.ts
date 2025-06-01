import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  postId: number;

  @IsNotEmpty()
  @ApiProperty({ default: 'Example content' })
  content: string;

  @ApiProperty({ default: 'Example jsonData' })
  jsonData?: any;
}
