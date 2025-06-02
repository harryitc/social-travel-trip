import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckGroupPlanDTO {
  @ApiProperty({
    description: 'Group ID',
    example: 456,
  })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;
}
