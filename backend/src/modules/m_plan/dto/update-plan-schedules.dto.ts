import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { PlanScheduleDTO } from './update-plan.dto';

export class UpdatePlanSchedulesDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;

  @ApiProperty({
    description: 'Schedules for specific day places',
    type: [PlanScheduleDTO],
  })
  @IsNotEmpty()
  @IsArray()
  schedules: PlanScheduleDTO[];
}
