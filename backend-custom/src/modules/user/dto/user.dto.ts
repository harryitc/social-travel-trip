import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDTO {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: '2000-01-01', required: false })
  @IsOptional()
  date_of_birth?: Date;

  @ApiProperty({ example: true, required: false })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsOptional()
  gender?: boolean;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}

export class RegisterUserDTO extends CreateUserDTO {}

export class LoginUserDTO {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDTO {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => {
    if (typeof value === 'string') return parseInt(value, 10);
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: '2000-01-01', required: false })
  @IsOptional()
  date_of_birth?: Date;

  @ApiProperty({ example: true, required: false })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsOptional()
  gender?: boolean;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}

export class ChangePasswordDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}

export class SearchUserDTO {
  @ApiProperty({ example: 'john', required: false })
  @IsString()
  @IsOptional()
  search_term?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    example: false,
    required: false,
    description: 'For autocomplete, return minimal user info',
  })
  @IsOptional()
  autocomplete?: boolean = false;
}

export class DeleteUserDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

export class GetUserDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
