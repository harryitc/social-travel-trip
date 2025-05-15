import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { LikeCommentDTO } from '../dto/like-comment.dto';

export class LikeCommentCommand implements ICommand {
  constructor(
    public readonly data: LikeCommentDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentCommandHandler
  implements ICommandHandler<LikeCommentCommand>
{
  private readonly logger = new Logger(LikeCommentCommand.name);

  constructor(private readonly repository: PostRepository) {}

  execute = async (command: LikeCommentCommand): Promise<any> => {
    const insertResult = await this.repository.likeComment(
      command.data,
      command.userId,
    );

    const idCreated = insertResult.rows[0].post_id;

    return Promise.resolve(idCreated);
  };
}
