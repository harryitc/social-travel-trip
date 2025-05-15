import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO } from '../dto/user.dto';

export class CreateUserCommand implements ICommand {
  constructor(public readonly data: CreateUserDTO) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  private readonly logger = new Logger(CreateUserCommand.name);

  constructor(private readonly repository: UserRepository) {}

  execute = async (command: CreateUserCommand): Promise<any> => {
    const data = await this.repository.createUser(command.data);

    return Promise.resolve(data.rows[0]);
  };
}
