import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const { data, user_id } = command;

    // Check if mini blog exists and user has permission to update it
    const miniBlogResult = await this.repository.getMiniBlogById(
      data.miniBlogId,
    );

    if (!miniBlogResult || miniBlogResult.rowCount == 0) {
      throw new NotFoundException(
        `Mini blog with ID ${data.miniBlogId} not found`,
      );
    }

    const miniBlog = miniBlogResult.rows[0];

    // Only the creator can update the mini blog
    if (miniBlog.user_id != user_id) {
      throw new UnauthorizedException(
        'You do not have permission to update this mini blog',
      );
    }

    // Proceed with update
    const updateResult = await this.repository.updateMiniBlog(data);
    const updatedBlog = updateResult.rows[0];

    return Promise.resolve(updatedBlog);
  };
}
