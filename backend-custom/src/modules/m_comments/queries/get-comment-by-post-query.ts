import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CommentRepository } from '../repositories/comment.repository';

export class GetCommentByPostQuery implements IQuery {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetCommentByPostQuery)
export class GetCommentByPostQueryHandler
  implements IQueryHandler<GetCommentByPostQuery>
{
  private readonly logger = new Logger(GetCommentByPostQuery.name);

  constructor(private readonly repository: CommentRepository) {}

  async execute(query: GetCommentByPostQuery) {
    const { postId } = query;

    try {
      const queryResult = await this.repository.getComments(postId);

      if (queryResult.rowCount === 0) {
        return {
          data: [],
          meta: {
            total: 0,
          },
        };
      }

      // Process the comments to include all required information
      const comments = queryResult.rows.map((row) => {
        // Extract data from json_data field
        const jsonData = row.json_data || {};
        const mentions = jsonData.mentions || [];
        const images = jsonData.images || [];

        // Calculate total likes
        const reactions = row.reactions || [];
        const totalLikes = reactions.reduce(
          (sum, reaction) => sum + parseInt(reaction.count),
          0,
        );

        // Process replies
        const replies = row.replies || [];
        const processedReplies = replies.map((reply) => {
          const replyJsonData = reply.json_data || {};
          const replyMentions = replyJsonData.mentions || [];
          const replyImages = replyJsonData.images || [];

          // Calculate total likes for reply
          const replyReactions = reply.reactions || [];
          const replyTotalLikes = replyReactions.reduce(
            (sum, reaction) => sum + parseInt(reaction.count),
            0,
          );

          return {
            id: reply.id,
            content: reply.content,
            created_at: reply.created_at,
            user: {
              id: reply.user_id,
              username: reply.username,
              full_name: reply.full_name,
              avatar_url: reply.avatar_url,
            },
            mentions: replyMentions,
            images: replyImages,
            stats: {
              total_likes: replyTotalLikes,
              reactions: replyReactions,
            },
          };
        });

        return {
          id: row.id,
          content: row.content,
          created_at: row.created_at,
          user: {
            id: row.user_id,
            username: row.username,
            full_name: row.full_name,
            avatar_url: row.avatar_url,
          },
          mentions,
          images,
          stats: {
            total_likes: totalLikes,
            reactions: reactions,
          },
          replies: processedReplies,
        };
      });

      return {
        data: comments,
        meta: {
          total: comments.length,
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching comments: ${error.message}`);
      throw error;
    }
  }
}
