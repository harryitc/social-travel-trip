import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { DeleteMiniBlogDTO } from '../dto/delete-mini-blog.dto';

export class DeleteMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: DeleteMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(DeleteMiniBlogCommand)
export class DeleteMiniBlogCommandHandler
  implements ICommandHandler<DeleteMiniBlogCommand>
{
  private readonly logger = new Logger(DeleteMiniBlogCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: DeleteMiniBlogCommand): Promise<any> => {
    const { data } = command;
    const deleteResult = await this.repository.deleteMiniBlog(data.miniBlogId);
    const deletedBlog = deleteResult.rows[0];

    return Promise.resolve(deletedBlog);
  };
}
