import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MdienDanRepository } from '../repositories/mdien-dan.repository';
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

  constructor(private readonly repository: MdienDanRepository) {}

  execute = async (command: ReplyCommentCommand): Promise<any> => {
    const insertResult = await this.repository.replyComment(
      command.data,
      command.user_id,
    );

    const idCreated = insertResult.rows[0].post_id;

    return Promise.resolve(idCreated);
  };
}
