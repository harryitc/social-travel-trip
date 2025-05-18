import { ICustomFilterQuery } from '@common/helpers/custom-api-query';
import { numberTransformer } from '@common/pipes/transformer/number.transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class FilterNotifyDto {
  @Transform(numberTransformer)
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number = 1;

  @Transform(numberTransformer)
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  perPage: number = 10;
  
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [
      {
        id: 'type',
        value: 'message',
      },
    ],
  })
  filters: Array<ICustomFilterQuery>;

  @IsIn(
    [
      'notify_id:desc',
      'notify_id:asc',
      'created_at:desc',
      'created_at:asc',
      'type:desc',
      'type:asc',
    ],
    { each: true },
  )
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ['created_at:desc'],
  })
  sorts: Array<string> = ['created_at:desc'];
}
