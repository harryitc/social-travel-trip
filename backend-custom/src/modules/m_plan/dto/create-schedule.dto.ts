import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDTO {
  @ApiProperty({
    description: 'Name of the schedule',
    example: 'Visit Golden Bridge',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the schedule',
    example: 'Take photos at the famous Golden Bridge',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Start time',
    example: '2023-05-20T09:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  start_time?: Date;

  @ApiProperty({
    description: 'End time',
    example: '2023-05-20T11:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  end_time?: Date;

  @ApiProperty({
    description: 'Location information (name, description, lat, lon)',
    example: {
      name: 'Golden Bridge',
      description: 'Famous bridge held by giant stone hands',
      lat: 15.9977,
      lon: 107.9886,
    },
  })
  @IsNotEmpty()
  @IsObject()
  location: any;

  @ApiProperty({
    description: 'Additional data in JSON format',
    example: {
      cost: 700000,
      currency: 'VND',
    },
  })
  @IsOptional()
  @IsObject()
  json_data?: any;

  @ApiProperty({
    description: 'Activity ID (if applicable)',
    example: 789,
  })
  @IsOptional()
  @IsNumber()
  activity_id?: number;

  @ApiProperty({
    description: 'Plan day place ID that this schedule belongs to',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_day_place_id: number;
}
