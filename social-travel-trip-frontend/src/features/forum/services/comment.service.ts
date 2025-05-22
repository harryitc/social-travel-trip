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
        payload,
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
        params: { post_id: postId },
      });
      return response.map((item: Comment) => new Comment(item));
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  /**
   * Like a comment
   * @param commentId Comment ID
   * @returns Promise with success status
   */
  async likeComment(commentId: string): Promise<{ success: boolean }> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/comments/like`, {
        comment_id: commentId,
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
   * @returns Promise with users who liked the comment
   */
  async getCommentLikes(commentId: string): Promise<PostAuthor[]> {
    try {
      const response: any = await Http.get(
        `${API_ENDPOINT.social_travel_trip}/comments/get-likes`,
        {
          params: { comment_id: commentId },
        },
      );
      return response.map((item: PostAuthor) => new PostAuthor(item));
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
