import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddPlanToGroupDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;

  @ApiProperty({
    description: 'Group ID',
    example: 456,
  })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;
}
