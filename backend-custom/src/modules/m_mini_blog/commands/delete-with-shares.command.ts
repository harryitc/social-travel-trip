import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const { data, user_id } = command;

    // Check if mini blog exists and user has permission to delete it
    const miniBlogResult = await this.repository.getMiniBlogById(
      data.miniBlogId,
    );

    if (!miniBlogResult || miniBlogResult.rowCount == 0) {
      throw new NotFoundException(
        `Mini blog with ID ${data.miniBlogId} not found`,
      );
    }

    const miniBlog = miniBlogResult.rows[0];

    // Only the creator can delete the mini blog with shares
    if (miniBlog.user_id != user_id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this mini blog',
      );
    }

    // Proceed with deletion
    const deleteResult = await this.repository.deleteMiniBlogWithShares(
      data.miniBlogId,
    );
    const deletedBlog = deleteResult.rows[0];

    return Promise.resolve(deletedBlog);
  };
}
