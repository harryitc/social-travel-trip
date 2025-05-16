import { Logger } from '@nestjs/common';
import { QueryHandler, ICommand, IQueryHandler } from '@nestjs/cqrs';

import { UserRepository } from '../repositories/user.repository';

export class FindByIDQuery implements ICommand {
  constructor(public readonly userId: number) {}
}

@QueryHandler(FindByIDQuery)
export class FindByIDQueryHandler implements IQueryHandler<FindByIDQuery> {
  private readonly logger = new Logger(FindByIDQuery.name);

  constructor(private readonly repository: UserRepository) {}

  execute = async (command: FindByIDQuery): Promise<any> => {
    const data = await this.repository.getUserByID(command.userId);

    return Promise.resolve(data.rows[0]);
  };
}
