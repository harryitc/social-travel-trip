import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'harryitc' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123123' })
  @IsString()
  password: string;
}

export class RegisterDTO {
  @ApiProperty({ example: 'harryitc' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123123' })
  @IsString()
  password: string;
}
