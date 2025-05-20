import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinGroupByCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  join_code: string;
}
