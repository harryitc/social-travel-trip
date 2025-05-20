import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { CreateShareLinkDTO } from '../dto/share-mini-blog.dto';

export class CreateShareLinkCommand implements ICommand {
  constructor(
    public readonly data: CreateShareLinkDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreateShareLinkCommand)
export class CreateShareLinkCommandHandler
  implements ICommandHandler<CreateShareLinkCommand>
{
  private readonly logger = new Logger(CreateShareLinkCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: CreateShareLinkCommand): Promise<any> => {
    const { data } = command;

    // Check if mini blog exists
    const miniBlogResult = await this.repository.getMiniBlogById(
      data.miniBlogId,
    );
    if (!miniBlogResult || miniBlogResult.rowCount == 0) {
      throw new NotFoundException(
        `Mini blog with ID ${data.miniBlogId} not found`,
      );
    }

    // Create share link
    const createResult = await this.repository.createShareLink(data);
    const createdShareLink = createResult.rows[0];

    return Promise.resolve(createdShareLink);
  };
}
