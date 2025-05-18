import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({ default: 'Thích' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateReactionDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  reaction_id: number;

  @ApiProperty({ default: 'Thích' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class DeleteReactionDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  reaction_id: number;
}

export class GetReactionDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  reaction_id: number;
}

export class QueryReactionDto {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
