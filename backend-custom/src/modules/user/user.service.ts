import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { FindByUsernameQuery } from './queries/find-by-username.query';
import { FindByIDQuery } from './queries/find-by-id.query';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async findByUsername(username: string) {
    return this.queryBus.execute(new FindByUsernameQuery(username));
  }

  async findById(id: number) {
    return this.queryBus.execute(new FindByIDQuery(id));
  }

  async create(data: CreateUserDTO) {
    return this.commandBus.execute(new CreateUserCommand(data));
  }
}
