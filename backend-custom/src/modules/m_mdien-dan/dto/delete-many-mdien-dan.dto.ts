   
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
    
export class DeleteMdienDanManyDTO {
  @IsNotEmpty()
  @ApiProperty({ example: [1,2,3] })
  @IsArray()
  arrayIds?: Array<number>;
}

