import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { PostRepository } from '../repositories/post.repository';

export class GetLikesPostQuery implements IQuery {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetLikesPostQuery)
export class GetLikesPostQueryHandler
  implements IQueryHandler<GetLikesPostQuery>
{
  constructor(private readonly repository: PostRepository) {}

  async execute(query: GetLikesPostQuery) {
    const { postId, userId } = query;

    try {
      // Get reaction counts
      const countResult = await this.repository.getLikePost(postId);

      // Get detailed users who liked the post
      const usersResult = await this.repository.getPostReactionUsers(postId);

      if (countResult.rowCount == 0) {
        return {
          total: 0,
          reactions: [],
          users: []
        };
      }

      // Tổng tất cả reaction
      const total = countResult.rows.reduce(
        (sum, row) => sum + Number(row.count),
        0,
      );

      // Format users data
      const users = usersResult.rows.map((row) => ({
        user_id: row.user_id,
        username: row.username,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        reaction_id: row.reaction_id,
        created_at: row.created_at || new Date().toISOString(), // Add timestamp
      }));

      return {
        total,
        reactions: countResult.rows, // [{ reaction_id: 2, count: 5 }, ...]
        users: users, // Detailed user list with reactions
      };
    } catch (error) {
      throw new NotFoundException(`Error getting post likes: ${error.message}`);
    }
  }
}
