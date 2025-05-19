import { Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    const { data, user_id } = command;

    try {
      // Check if post exists
      const postResult = await this.repository.getPostById(data.postId);

      if (!postResult || !postResult.rows || postResult.rows.length === 0) {
        throw new NotFoundException(`Post with ID ${data.postId} not found`);
      }

      // Check if user is the owner of the post
      const post = postResult.rows[0];
      if (post.user_id !== user_id) {
        throw new UnauthorizedException('You can only update your own posts');
      }

      // Update post
      const updateResult = await this.repository.updatePost(data);
      const updatedPost = updateResult.rows[0];

      return Promise.resolve(updatedPost);
    } catch (error) {
      this.logger.error(`Failed to update post: ${error.message}`);
      throw error;
    }
  };
}
