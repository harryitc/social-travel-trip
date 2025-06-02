import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

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

  @ApiProperty({ example: 'Harry ITC', required: false })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({ example: 'harry@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ example: 'harry@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ConfirmResetPasswordDTO {
  @ApiProperty({ example: 'reset-token-123' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
