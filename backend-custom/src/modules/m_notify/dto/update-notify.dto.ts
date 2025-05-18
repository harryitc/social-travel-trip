import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNotifyDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  notify_id: number;

  @ApiProperty({ example: { title: 'Updated notification', message: 'Updated message' } })
  @IsOptional()
  json_data?: any;

  @ApiProperty({ example: 'message', description: 'Type of notification' })
  @IsOptional()
  @IsString()
  type?: string;
}
