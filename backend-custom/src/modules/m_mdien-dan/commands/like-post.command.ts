import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MdienDanRepository } from '../repositories/mdien-dan.repository';
import { LikePostDTO } from '../dto/like-post.dto';

export class LikePostCommand implements ICommand {
  constructor(
    public readonly data: LikePostDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostCommandHandler
  implements ICommandHandler<LikePostCommand>
{
  private readonly logger = new Logger(LikePostCommand.name);

  constructor(private readonly repository: MdienDanRepository) {}

  execute = async (command: LikePostCommand): Promise<any> => {
    const insertResult = await this.repository.likePost(
      command.data,
      command.userId,
    );

    const idCreated = insertResult.rows[0].post_id;

    return Promise.resolve(idCreated);
  };
}
