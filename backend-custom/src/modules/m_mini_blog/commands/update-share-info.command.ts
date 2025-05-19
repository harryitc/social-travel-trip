import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { UpdateShareInfoDTO } from '../dto/share-mini-blog.dto';

export class UpdateShareInfoCommand implements ICommand {
  constructor(
    public readonly data: UpdateShareInfoDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(UpdateShareInfoCommand)
export class UpdateShareInfoCommandHandler
  implements ICommandHandler<UpdateShareInfoCommand>
{
  private readonly logger = new Logger(UpdateShareInfoCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: UpdateShareInfoCommand): Promise<any> => {
    const { data, user_id } = command;

    // Check if share exists and user has permission to update it
    const shareResult = await this.repository.getShareableById(
      data.miniBlogShareableId,
    );

    if (!shareResult || shareResult.rowCount == 0) {
      throw new NotFoundException(
        `Share with ID ${data.miniBlogShareableId} not found`,
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

    // Only the creator of the mini blog can update the share info
    if (miniBlog.user_id != user_id) {
      throw new UnauthorizedException(
        'You do not have permission to update this share',
      );
    }

    // Proceed with update
    const updateResult = await this.repository.updateShareInfo(data);
    const updatedShare = updateResult.rows[0];

    return Promise.resolve(updatedShare);
  };
}
