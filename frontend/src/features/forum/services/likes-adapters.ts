import { postService } from './post.service';
import { commentService } from './comment.service';
import { LikesService } from '../components/likes-modal';

/**
 * Adapter for post likes service
 */
export const postLikesAdapter: LikesService = {
  async getLikes(postId: string) {
    const response = await postService.getPostLikes(postId);
    return {
      total: response.total || 0,
      reactions: response.reactions || [],
      users: response.users || []
    };
  },

  async getReactionUsers(postId: string, reactionId?: number) {
    const response = await postService.getPostReactionUsers(postId, reactionId);
    return {
      data: response.data || [],
      meta: response.meta || { total: 0 }
    };
  }
};

/**
 * Adapter for comment likes service
 */
export const commentLikesAdapter: LikesService = {
  async getLikes(commentId: string) {
    const response = await commentService.getCommentLikes(commentId);
    return {
      total: response.total || 0,
      reactions: response.reactions || [],
      users: response.users || []
    };
  },

  async getReactionUsers(commentId: string, reactionId?: number) {
    const response = await commentService.getCommentReactionUsers(commentId, reactionId);
    return {
      data: response.data || [],
      meta: response.meta || { total: 0 }
    };
  }
};
