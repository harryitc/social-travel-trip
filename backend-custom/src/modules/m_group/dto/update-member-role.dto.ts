import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ enum: ['admin', 'moderator', 'member'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'moderator', 'member'])
  role: string;
}
