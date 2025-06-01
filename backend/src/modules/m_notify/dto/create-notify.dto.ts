import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotifyDto {
  @ApiProperty({ example: { title: 'New notification', message: 'You have a new message' } })
  @IsOptional()
  json_data?: any;

  @ApiProperty({ example: 'message', description: 'Type of notification' })
  @IsNotEmpty()
  @IsString()
  type: string;
}
