import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { CreatePostDTO } from '../dto/create-post.dto';

export class CreatePostCommand implements ICommand {
  constructor(
    public readonly data: CreatePostDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  private readonly logger = new Logger(CreatePostCommand.name);

  constructor(private readonly repository: PostRepository) {}

  execute = async (command: CreatePostCommand): Promise<any> => {
    const insertResult = await this.repository.createPost(
      command.data,
      command.user_id,
    );

    const idCreated = insertResult.rows[0];

    return Promise.resolve(idCreated);
  };
}
