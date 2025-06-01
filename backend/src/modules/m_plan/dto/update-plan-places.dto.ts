import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { PlanDayPlaceDTO } from './update-plan.dto';

export class UpdatePlanPlacesDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;

  @ApiProperty({
    description: 'Day places with locations',
    type: [PlanDayPlaceDTO],
  })
  @IsNotEmpty()
  @IsArray()
  day_places: PlanDayPlaceDTO[];
}
