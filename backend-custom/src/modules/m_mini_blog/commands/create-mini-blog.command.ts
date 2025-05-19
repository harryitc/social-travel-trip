import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { CreateMiniBlogDTO } from '../dto/create-mini-blog.dto';

export class CreateMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: CreateMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreateMiniBlogCommand)
export class CreateMiniBlogCommandHandler
  implements ICommandHandler<CreateMiniBlogCommand>
{
  private readonly logger = new Logger(CreateMiniBlogCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: CreateMiniBlogCommand): Promise<any> => {
    const { data, user_id } = command;

    // Create mini blog
    const insertResult = await this.repository.createMiniBlog(data, user_id);
    const createdBlog = insertResult.rows[0];

    return Promise.resolve(createdBlog);
  };
}
