import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMiniBlogDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  miniBlogId: number;
}
