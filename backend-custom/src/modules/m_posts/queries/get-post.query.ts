import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { PostRepository } from '../repositories/post.repository';
import { GetPostDTO } from '../dto/get-post.dto';

export class GetPostsQuery implements IQuery {
  constructor(
    public readonly filterDTO: GetPostDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<GetPostsQuery> {
  private readonly logger = new Logger(GetPostsQuery.name);

  constructor(private readonly repository: PostRepository) {}

  async execute(query: GetPostsQuery) {
    const { filterDTO, userId } = query;
    const { page = 1, limit = 10 } = filterDTO;

    try {
      const [queryResult, count] = await Promise.all([
        this.repository.getPosts(page, limit),
        this.repository.getCountPosts(),
      ]);

      if (queryResult.rowCount === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
          },
        };
      }

      // Process the posts to include all required information
      const posts = queryResult.rows.map((row) => {
        // Extract data from json_data field
        const jsonData = row.json_data || {};
        const mentions = jsonData.mentions || [];
        const hashtags = jsonData.hashtags || [];
        const location = jsonData.location || null;
        const images = jsonData.images || [];

        // Calculate total likes
        const reactions = row.reactions || [];
        const totalLikes = reactions.reduce(
          (sum, reaction) => sum + parseInt(reaction.count),
          0,
        );

        return {
          id: row.post_id,
          content: row.content,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user: {
            id: row.user_id,
            username: row.username,
            full_name: row.full_name,
            avatar_url: row.avatar_url,
          },
          mentions,
          hashtags,
          location,
          images,
          stats: {
            total_likes: totalLikes,
            total_comments: parseInt(row.comment_count) || 0,
            reactions: reactions,
          },
        };
      });

      return {
        data: posts,
        meta: {
          total: parseInt(count.rows[0].count) || 0,
          page,
          limit,
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching posts: ${error.message}`);
      throw error;
    }
  }
}
