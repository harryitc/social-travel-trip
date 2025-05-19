import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { ShareMiniBlogDTO } from '../dto/share-mini-blog.dto';

export class ShareMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: ShareMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(ShareMiniBlogCommand)
export class ShareMiniBlogCommandHandler
  implements ICommandHandler<ShareMiniBlogCommand>
{
  private readonly logger = new Logger(ShareMiniBlogCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: ShareMiniBlogCommand): Promise<any> => {
    const { data, user_id } = command;
    const { miniBlogId, platform, shareData } = data;
    
    const shareResult = await this.repository.shareMiniBlog(
      miniBlogId,
      platform,
      shareData,
      user_id,
    );
    
    const sharedBlog = shareResult.rows[0];
    return Promise.resolve(sharedBlog);
  };
}
