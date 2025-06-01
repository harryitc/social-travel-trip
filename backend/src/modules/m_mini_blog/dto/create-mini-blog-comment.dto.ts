import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMiniBlogCommentDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: null })
  parentId?: number | null;

  @IsNotEmpty()
  @ApiProperty({ default: 'Example comment content' })
  message: string;

  @IsOptional()
  @ApiProperty({ default: {} })
  jsonData?: any;
}

export class ReplyMiniBlogCommentDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  parentId: number;

  @IsNotEmpty()
  @ApiProperty({ default: 'Example reply content' })
  message: string;

  @IsOptional()
  @ApiProperty({ default: {} })
  jsonData?: any;
}
