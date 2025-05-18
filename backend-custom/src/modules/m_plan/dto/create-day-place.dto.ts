import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateDayPlaceDTO {
  @ApiProperty({
    description: 'Plan ID',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  plan_id: number;

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
}
