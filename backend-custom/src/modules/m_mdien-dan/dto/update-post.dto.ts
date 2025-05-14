  
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateMdienDanDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example id serial' })
  user_id?: number;

  
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
 