import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { DeleteShareLinkDTO } from '../dto/share-mini-blog.dto';

export class DeleteShareLinkCommand implements ICommand {
  constructor(
    public readonly data: DeleteShareLinkDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(DeleteShareLinkCommand)
export class DeleteShareLinkCommandHandler
  implements ICommandHandler<DeleteShareLinkCommand>
{
  private readonly logger = new Logger(DeleteShareLinkCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: DeleteShareLinkCommand): Promise<any> => {
    const { data, user_id } = command;

    // Check if share exists and user has permission to delete it
    const shareResult = await this.repository.getShareableById(
      data.miniBlogShareableId,
    );

    if (!shareResult || shareResult.rowCount == 0) {
      throw new NotFoundException(
        `Share link with ID ${data.miniBlogShareableId} not found`,
      );
    }

    // Get the mini blog to check ownership
    const share = shareResult.rows[0];
    const miniBlogResult = await this.repository.getMiniBlogById(
      share.mini_blog_id,
    );

    if (!miniBlogResult || miniBlogResult.rowCount == 0) {
      throw new NotFoundException(`Mini blog not found for this share`);
    }

    const miniBlog = miniBlogResult.rows[0];

    // Only the creator of the mini blog can delete the share link
    if (miniBlog.user_id != user_id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this share link',
      );
    }

    // Delete share link
    const deleteResult = await this.repository.deleteShareLink(
      data.miniBlogShareableId,
    );
    const deletedShareLink = deleteResult.rows[0];

    return Promise.resolve(deletedShareLink);
  };
}
