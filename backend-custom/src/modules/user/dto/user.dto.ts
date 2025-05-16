import { IsEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsEmpty()
  username: string;

  @IsEmpty()
  password: string;
}
