import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { CreateCommentDTO } from '../dto/create-comment.dto';

export class CreateCommentCommand implements ICommand {
  constructor(
    public readonly data: CreateCommentDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  private readonly logger = new Logger(CreateCommentCommand.name);

  constructor(private readonly repository: PostRepository) {}

  execute = async (command: CreateCommentCommand): Promise<any> => {
    const insertResult = await this.repository.createComment(
      command.data,
      command.user_id,
    );

    const idCreated = insertResult.rows[0];

    return Promise.resolve(idCreated);
  };
}
