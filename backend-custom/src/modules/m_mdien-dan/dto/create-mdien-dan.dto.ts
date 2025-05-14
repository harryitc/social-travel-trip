

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMdienDanDTO {
  
  @IsNotEmpty()
  @ApiProperty({ example: 'Example data jsonb' })
  info?: any;
  
  @IsNotEmpty()
  @ApiProperty({ example: 'Example data timestamp' })
  time_create?: Date;
  
  @IsNotEmpty()
  @ApiProperty({ example: 'Example data timestamp' })
  time_update?: Date;
    
}

