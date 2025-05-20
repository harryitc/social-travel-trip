import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ enum: ['admin', 'moderator', 'member'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'moderator', 'member'])
  role: string;
}
