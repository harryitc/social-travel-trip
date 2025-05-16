import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../repositories/comment.repository';
import { ReplyCommentDTO } from '../dto/reply-comment.dto';

export class ReplyCommentCommand implements ICommand {
  constructor(
    public readonly data: ReplyCommentDTO,
    public readonly user_id: string,
  ) {}
}

@CommandHandler(ReplyCommentCommand)
export class ReplyCommentCommandHandler
  implements ICommandHandler<ReplyCommentCommand>
{
  private readonly logger = new Logger(ReplyCommentCommand.name);

  constructor(private readonly repository: CommentRepository) {}

  execute = async (command: ReplyCommentCommand): Promise<any> => {
    const insertResult = await this.repository.replyComment(
      command.data,
      command.user_id,
    );

    const idCreated = insertResult.rows[0];

    return Promise.resolve(idCreated);
  };
}
