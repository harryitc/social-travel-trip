import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShareMiniBlogDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'facebook' })
  platform: string;

  @IsOptional()
  @ApiProperty({ default: {} })
  shareData?: any;
}

export class UpdateShareInfoDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogShareableId: number;

  @IsOptional()
  @ApiProperty({ default: 'Updated title' })
  title?: string;

  @IsOptional()
  @ApiProperty({ default: 'Updated description' })
  description?: string;

  @IsOptional()
  @ApiProperty({ default: true })
  isShowMap?: boolean;

  @IsOptional()
  @ApiProperty({ default: true })
  isShowTimeline?: boolean;
}

export class GetSharesListDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;
}

export class CreateShareLinkDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;

  @IsOptional()
  @ApiProperty({ default: 'Custom title for share' })
  title?: string;

  @IsOptional()
  @ApiProperty({ default: 'Custom description for share' })
  description?: string;

  @IsOptional()
  @ApiProperty({ default: true })
  isShowMap?: boolean;

  @IsOptional()
  @ApiProperty({ default: true })
  isShowTimeline?: boolean;
}

export class DeleteShareLinkDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogShareableId: number;
}
