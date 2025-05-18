import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsObject, IsArray } from 'class-validator';

export class PlanDayPlaceDTO {
  @ApiProperty({
    description: 'Day number',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  ngay: string;

  @ApiProperty({
    description: 'Location information (name, description, lat, lon)',
    example: {
      name: 'Ba Na Hills',
      description: 'Mountain resort and theme park',
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
      notes: 'Visit in the morning',
    },
  })
  @IsOptional()
  @IsObject()
  json_data?: any;

  @ApiProperty({
    description: 'Plan day place ID (for updates)',
    example: 123,
  })
  @IsOptional()
  @IsNumber()
  plan_day_place_id?: number;
}

export class PlanScheduleDTO {
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
  start_time?: Date;

  @ApiProperty({
    description: 'End time',
    example: '2023-05-20T11:00:00Z',
  })
  @IsOptional()
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
    description: 'Plan schedule ID (for updates)',
    example: 456,
  })
  @IsOptional()
  @IsNumber()
  plan_schedule_id?: number;

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

export class UpdatePlanDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;

  @ApiProperty({
    description: 'Name of the plan',
    example: 'Trip to Da Nang',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'A 3-day trip to Da Nang with family',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Location information (name, description, lat, lon)',
    example: {
      name: 'Da Nang',
      description: 'Coastal city in central Vietnam',
      lat: 16.0544,
      lon: 108.2022,
    },
  })
  @IsOptional()
  @IsObject()
  location?: any;

  @ApiProperty({
    description: 'Thumbnail URL for the plan',
    example: 'https://example.com/images/danang.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiProperty({
    description: 'Status of the plan (public or private)',
    example: 'public',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Day places with schedules',
    type: [PlanDayPlaceDTO],
  })
  @IsOptional()
  @IsArray()
  day_places?: PlanDayPlaceDTO[];

  @ApiProperty({
    description: 'Schedules for specific day places',
    type: [PlanScheduleDTO],
  })
  @IsOptional()
  @IsArray()
  schedules?: PlanScheduleDTO[];
}
