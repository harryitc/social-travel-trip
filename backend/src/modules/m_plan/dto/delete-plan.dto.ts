import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePlanDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;
}
