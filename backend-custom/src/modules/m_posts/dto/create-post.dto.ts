import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 'Example content' })
  content: string;

  @ApiProperty({ default: {} })
  jsonData?: any;
}
