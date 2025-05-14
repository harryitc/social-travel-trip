import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MdienDanRepository } from '../repositories/mdien-dan.repository';
import { CreatePostDTO } from '../dto/create-post.dto';

export class CreatePostCommand implements ICommand {
  constructor(
    public readonly data: CreatePostDTO,
    public readonly user_id: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  private readonly logger = new Logger(CreatePostCommand.name);

  constructor(private readonly repository: MdienDanRepository) {}

  execute = async (command: CreatePostCommand): Promise<any> => {
    const insertResult = await this.repository.createPost(
      command.data,
      command.user_id,
    );

    const idCreated = insertResult.rows[0].post_id;

    return Promise.resolve(idCreated);
  };
}
