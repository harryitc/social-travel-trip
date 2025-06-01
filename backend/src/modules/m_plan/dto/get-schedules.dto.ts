import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetSchedulesDTO {
  @ApiProperty({
    description: 'Plan day place ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_day_place_id: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
