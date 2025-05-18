import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({ description: 'Reaction name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateReactionDto {
  @ApiProperty({ description: 'Reaction ID' })
  @IsNotEmpty()
  @IsNumber()
  reaction_id: number;

  @ApiProperty({ description: 'Reaction name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class DeleteReactionDto {
  @ApiProperty({ description: 'Reaction ID' })
  @IsNotEmpty()
  @IsNumber()
  reaction_id: number;
}

export class GetReactionDto {
  @ApiProperty({ description: 'Reaction ID' })
  @IsNotEmpty()
  @IsNumber()
  reaction_id: number;
}

export class QueryReactionDto {
  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
