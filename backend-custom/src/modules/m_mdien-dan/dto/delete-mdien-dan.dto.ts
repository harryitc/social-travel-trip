   
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
    
export class DeleteMdienDanDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example id serial' })
  user_id?: number;
}

