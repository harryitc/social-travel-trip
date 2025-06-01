import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class LikeMiniBlogDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 1 })
  reactionId?: number;
}

export class LikeMiniBlogCommentDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  commentId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 1 })
  reactionId?: number;
}
