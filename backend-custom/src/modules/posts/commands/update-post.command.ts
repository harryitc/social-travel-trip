import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { UpdatePostDTO } from '../dto/update-post.dto';

export class UpdatePostCommand implements ICommand {
  constructor(
    public readonly data: UpdatePostDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand>
{
  private readonly logger = new Logger(UpdatePostCommand.name);

  constructor(private readonly repository: PostRepository) {}

  execute = async (command: UpdatePostCommand): Promise<any> => {
    const insertResult = await this.repository.updatePost(command.data);

    const idCreated = insertResult.rows[0].post_id;

    return Promise.resolve(idCreated);
  };
}
