import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetDayPlacesDTO {
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
  day: string;
}
