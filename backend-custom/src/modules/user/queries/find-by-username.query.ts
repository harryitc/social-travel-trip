import { Logger } from '@nestjs/common';
import { QueryHandler, ICommand, IQueryHandler } from '@nestjs/cqrs';

import { UserRepository } from '../repositories/user.repository';

export class FindByUsernameQuery implements ICommand {
  constructor(public readonly username: string) {}
}

@QueryHandler(FindByUsernameQuery)
export class FindByUsernameQueryHandler
  implements IQueryHandler<FindByUsernameQuery>
{
  private readonly logger = new Logger(FindByUsernameQuery.name);

  constructor(private readonly repository: UserRepository) {}

  execute = async (command: FindByUsernameQuery): Promise<any> => {
    const data = await this.repository.getUserByUsername(command.username);

    return Promise.resolve(data.rows[0]);
  };
}
