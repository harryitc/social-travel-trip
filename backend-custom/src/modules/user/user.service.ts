import { Injectable } from '@nestjs/common';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  SearchUserDTO,
  DeleteUserDTO,
  GetUserDTO,
  RegisterUserDTO,
} from './dto/user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { ChangePasswordCommand } from './commands/change-password.command';
import { DeleteUserCommand } from './commands/delete-user.command';
import { FindByUsernameQuery } from './queries/find-by-username.query';
import { FindByIDQuery } from './queries/find-by-id.query';
import { GetUserDetailsQuery } from './queries/get-user-details.query';
import { SearchUsersQuery } from './queries/search-users.query';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  // Query methods
  async findByUsername(username: string) {
    return this.queryBus.execute(new FindByUsernameQuery(username));
  }

  async findById(id: number) {
    return this.queryBus.execute(new FindByIDQuery(id));
  }

  async getUserDetails(dto: GetUserDTO, userId: number) {
    return this.queryBus.execute(new GetUserDetailsQuery(dto, userId));
  }

  async searchUsers(dto: SearchUserDTO, userId: number) {
    return this.queryBus.execute(new SearchUsersQuery(dto, userId));
  }

  // Command methods
  async create(data: CreateUserDTO) {
    return this.commandBus.execute(new CreateUserCommand(data));
  }

  async register(data: RegisterUserDTO) {
    return this.commandBus.execute(new CreateUserCommand(data));
  }

  async updateUser(data: UpdateUserDTO, userId: number) {
    return this.commandBus.execute(new UpdateUserCommand(data, userId));
  }

  async changePassword(data: ChangePasswordDTO, userId: number) {
    return this.commandBus.execute(new ChangePasswordCommand(data, userId));
  }

  async deleteUser(data: DeleteUserDTO, userId: number) {
    return this.commandBus.execute(new DeleteUserCommand(data, userId));
  }
}
