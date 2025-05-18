import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMiniBlogCommentsDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;
}

export class GetMiniBlogCommentLikesDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  commentId: number;
}

export class GetMiniBlogLikesDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;
}
