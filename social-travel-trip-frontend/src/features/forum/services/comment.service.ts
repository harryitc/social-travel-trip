import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import { Comment, CreateCommentPayload, CommentReactionUser } from '../models/comment.model';
import { PostAuthor } from '../models/post.model';

/**
 * Service for handling comments
 */
export const commentService = {
  /**
   * Create a new comment
   * @param payload Comment creation payload
   * @returns Promise with created comment
   */
  async createComment(payload: CreateCommentPayload): Promise<Comment> {
    try {
      const response: any = await Http.post(
        `${API_ENDPOINT.social_travel_trip}/comments/create`,
        {
          postId: parseInt(payload.post_id),
          content: payload.content,
          parentId: payload.parent_id ? parseInt(payload.parent_id) : null,
          jsonData: {}
        },
      );
      return new Comment(response);
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  /**
   * Get comments for a post
   * @param postId Post ID
   * @returns Promise with comments
   */
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const response: any = await Http.get(`${API_ENDPOINT.social_travel_trip}/comments/get`, {
        params: { postId: postId },
      });
      return response.data?.map((item: any) => new Comment(item)) || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  /**
   * Like a comment
   * @param commentId Comment ID
   * @param reactionId Reaction ID (default: 2 for like)
   * @returns Promise with success status
   */
  async likeComment(commentId: string, reactionId: number = 2): Promise<{ success: boolean }> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/comments/like`, {
        commentId: parseInt(commentId),
        reactionId: reactionId,
      });
      return { success: true };
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  },

  /**
   * Get users who liked a comment
   * @param commentId Comment ID
   * @returns Promise with likes data
   */
  async getCommentLikes(commentId: string): Promise<{
    total: number;
    reactions: { reaction_id: number; count: number }[];
    users: (PostAuthor & { reaction_id: number })[];
  }> {
    try {
      const response: any = await Http.get(
        `${API_ENDPOINT.social_travel_trip}/comments/get-likes`,
        {
          params: { commentId: parseInt(commentId) },
        },
      );
      return {
        total: response.total || 0,
        reactions: response.reactions || [],
        users: response.users?.map((item: any) => ({
          ...new PostAuthor(item),
          reaction_id: item.reaction_id
        })) || []
      };
    } catch (error) {
      console.error('Error getting comment likes:', error);
      throw error;
    }
  },

  /**
   * Get users who reacted to a comment
   * @param commentId Comment ID
   * @returns Promise with users who reacted to the comment
   */
  async getCommentReactionUsers(commentId: string): Promise<CommentReactionUser[]> {
    try {
      const response: any = await Http.get(
        `${API_ENDPOINT.social_travel_trip}/comments/reaction-users`,
        {
          params: { comment_id: commentId },
        },
      );
      return response.map((item: CommentReactionUser) => new CommentReactionUser(item));
    } catch (error) {
      console.error('Error getting comment reaction users:', error);
      throw error;
    }
  },
};
