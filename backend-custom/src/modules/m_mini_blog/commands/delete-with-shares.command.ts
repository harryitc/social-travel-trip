import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { DeleteMiniBlogDTO } from '../dto/delete-mini-blog.dto';

export class DeleteWithSharesCommand implements ICommand {
  constructor(
    public readonly data: DeleteMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(DeleteWithSharesCommand)
export class DeleteWithSharesCommandHandler
  implements ICommandHandler<DeleteWithSharesCommand>
{
  private readonly logger = new Logger(DeleteWithSharesCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: DeleteWithSharesCommand): Promise<any> => {
    const { data } = command;
    
    const deleteResult = await this.repository.deleteMiniBlogWithShares(data.miniBlogId);
    const deletedBlog = deleteResult.rows[0];
    
    return Promise.resolve(deletedBlog);
  };
}
