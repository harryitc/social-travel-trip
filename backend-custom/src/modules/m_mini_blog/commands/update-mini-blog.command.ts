import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { UpdateMiniBlogDTO } from '../dto/update-mini-blog.dto';

export class UpdateMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: UpdateMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(UpdateMiniBlogCommand)
export class UpdateMiniBlogCommandHandler
  implements ICommandHandler<UpdateMiniBlogCommand>
{
  private readonly logger = new Logger(UpdateMiniBlogCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: UpdateMiniBlogCommand): Promise<any> => {
    const updateResult = await this.repository.updateMiniBlog(command.data);
    const updatedBlog = updateResult.rows[0];

    return Promise.resolve(updatedBlog);
  };
}
