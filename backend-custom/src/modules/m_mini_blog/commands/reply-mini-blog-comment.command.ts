import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { ReplyMiniBlogCommentDTO } from '../dto/create-mini-blog-comment.dto';
import { UserService } from '@modules/user/user.service';

export class ReplyMiniBlogCommentCommand implements ICommand {
  constructor(
    public readonly data: ReplyMiniBlogCommentDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(ReplyMiniBlogCommentCommand)
export class ReplyMiniBlogCommentCommandHandler
  implements ICommandHandler<ReplyMiniBlogCommentCommand>
{
  private readonly logger = new Logger(ReplyMiniBlogCommentCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly userService: UserService,
  ) {}

  execute = async (command: ReplyMiniBlogCommentCommand): Promise<any> => {
    const { data, user_id } = command;

    // Check if mini blog exists
    const miniBlogResult = await this.repository.getMiniBlogById(
      data.miniBlogId,
    );
    if (!miniBlogResult || miniBlogResult.rowCount === 0) {
      throw new NotFoundException(
        `Mini blog with ID ${data.miniBlogId} not found`,
      );
    }

    // Check if parent comment exists
    const parentCommentResult = await this.repository.getCommentById(
      data.parentId,
    );
    if (!parentCommentResult || parentCommentResult.rowCount === 0) {
      throw new NotFoundException(
        `Parent comment with ID ${data.parentId} not found`,
      );
    }

    // Create reply
    const insertResult = await this.repository.replyComment(data, user_id);
    const createdReply = insertResult.rows[0];

    try {
      // We already have the parent comment from the check above
      const parentComment = parentCommentResult.rows[0];
      const commentOwnerId = parentComment.user_id;

      // Don't notify if the user is replying to their own comment
      if (commentOwnerId !== user_id) {
        // Get user details for notification
        const replier = await this.userService.findById(user_id);

        if (replier) {
          // Notify comment owner about the reply
         
        }
      }
    } catch (error) {
      // Log error but don't fail the reply creation if notification fails
      this.logger.error(
        `Failed to create reply notification: ${error.message}`,
      );
    }

    return Promise.resolve(createdReply);
  };
}
