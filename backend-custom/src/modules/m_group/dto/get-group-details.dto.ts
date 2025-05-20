import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetGroupDetailsDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;
}
