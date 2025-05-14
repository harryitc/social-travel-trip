---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/dto/filter-<%= h.changeCase.kebabCase(moduleName)%>.dto.ts
---
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

export class Filter<%= h.changeCase.pascalCase(moduleName)%>DTO {
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
      '<%= idField[0]%>:desc',
      '<%= idField[0]%>:asc',
      <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
      "<%= entityAttributes[i] %>:desc",
      "<%= entityAttributes[i] %>:asc",
      <% } %>  
    ],
    { each: true },
  )
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [`<%= idField[0]%>:desc`],
  })
  sorts: Array<string>;
}
