import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { PostRepository } from '../repositories/post.repository';

export class GetPostReactionUsersQuery implements IQuery {
  constructor(
    public readonly postId: number,
    public readonly reactionId?: number,
    public readonly userId?: number,
  ) {}
}

@QueryHandler(GetPostReactionUsersQuery)
export class GetPostReactionUsersQueryHandler
  implements IQueryHandler<GetPostReactionUsersQuery>
{
  private readonly logger = new Logger(GetPostReactionUsersQuery.name);

  constructor(private readonly repository: PostRepository) {}

  async execute(query: GetPostReactionUsersQuery) {
    const { postId, reactionId } = query;

    try {
      // Get users who reacted to the post
      const result = await this.repository.getPostReactionUsers(
        postId,
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
        user_id: row.user_id,
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
      this.logger.error(`Error fetching post reaction users: ${error.message}`);
      throw error;
    }
  }
}
