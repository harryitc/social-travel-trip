import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';
import { Logger } from '@nestjs/common';

import { PostRepository } from '../repositories/post.repository';

export class GetPostDetailQuery implements IQuery {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailQueryHandler
  implements IQueryHandler<GetPostDetailQuery>
{
  private readonly logger = new Logger(GetPostDetailQuery.name);

  constructor(private readonly repository: PostRepository) {}

  async execute(query: GetPostDetailQuery) {
    const { postId, userId } = query;

    try {
      // Get post details
      const postResult = await this.repository.getPostDetail(postId);

      if (postResult.rowCount === 0) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      const post = postResult.rows[0];

      // Extract data from json_data field
      const jsonData = post.json_data || {};
      const mentions = jsonData.mentions || [];
      const hashtags = jsonData.hashtags || [];
      const location = jsonData.location || null;
      const images = jsonData.images || [];

      // Calculate total likes
      const reactions = post.reactions || [];
      const totalLikes = reactions.reduce(
        (sum, reaction) => sum + parseInt(reaction.count),
        0,
      );

      return {
        id: post.post_id,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user: {
          id: post.user_id,
          username: post.username,
          full_name: post.full_name,
          avatar_url: post.avatar_url,
        },
        mentions,
        hashtags,
        location,
        images,
        stats: {
          total_likes: totalLikes,
          total_comments: parseInt(post.comment_count) || 0,
          reactions: reactions,
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching post detail: ${error.message}`);
      throw error;
    }
  }
}
