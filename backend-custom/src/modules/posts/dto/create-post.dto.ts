import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example content' })
  content: string;

  @ApiProperty({ example: 'Example jsonData' })
  jsonData?: any;

  @ApiProperty({ example: 'Example placeId' })
  placeId?: string;
}
