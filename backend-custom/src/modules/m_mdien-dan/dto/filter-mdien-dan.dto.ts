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

export class FilterMdienDanDTO {
  @Transform(numberTransformer)
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number;

  @Transform(numberTransformer)
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  perPage: number;
  
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [
      {
        id: 'searchString',
        value: 'enter your search value',
      },
    ],
  })
  filters: Array<ICustomFilterQuery>;

  // Allow only this keys to sort follow syntax "fieldName:desc/asc"
  // You can delete sort field if it's not nescessarry
  @IsIn(
    [
      'user_id:desc',
      'user_id:asc',
      
      "info:desc",
      "info:asc",
      
      "time_create:desc",
      "time_create:asc",
      
      "time_update:desc",
      "time_update:asc",
        
    ],
    { each: true },
  )
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [`user_id:desc`],
  })
  sorts: Array<string>;
}
