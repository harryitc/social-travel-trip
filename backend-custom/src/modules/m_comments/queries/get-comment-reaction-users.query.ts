import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CommentRepository } from '../repositories/comment.repository';

export class GetCommentReactionUsersQuery implements IQuery {
  constructor(
    public readonly commentId: number,
    public readonly reactionId?: number,
    public readonly userId?: number,
  ) {}
}

@QueryHandler(GetCommentReactionUsersQuery)
export class GetCommentReactionUsersQueryHandler
  implements IQueryHandler<GetCommentReactionUsersQuery>
{
  private readonly logger = new Logger(GetCommentReactionUsersQuery.name);

  constructor(private readonly repository: CommentRepository) {}

  async execute(query: GetCommentReactionUsersQuery) {
    const { commentId, reactionId } = query;

    try {
      // Get users who reacted to the comment
      const result = await this.repository.getCommentReactionUsers(
        commentId,
        reactionId,
      );

      if (result.rowCount === 0) {
        return {
          data: [],
          meta: {
            total: 0,
          },
        };
      }

      // Format the response
      const users = result.rows.map((row) => ({
        id: row.user_id,
        username: row.username,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        reaction_id: row.reaction_id,
      }));

      return {
        data: users,
        meta: {
          total: users.length,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching comment reaction users: ${error.message}`,
      );
      throw error;
    }
  }
}
