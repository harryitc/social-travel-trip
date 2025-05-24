import { LikesService } from '../../forum/components/likes-modal';
import { tripGroupService } from './trip-group.service';

/**
 * Adapter for message likes service
 */
export const messageLikesAdapter: LikesService = {
  async getLikes(messageId: string) {
    const response = await tripGroupService.getMessageReactions(parseInt(messageId));
    return {
      total: response.total || 0,
      reactions: response.reactions || [],
      users: response.users || []
    };
  },

  async getReactionUsers(messageId: string, reactionId?: number) {
    const response = await tripGroupService.getMessageReactionUsers(parseInt(messageId), reactionId);
    return {
      data: response.data || [],
      meta: response.meta || { total: 0 }
    };
  }
};

/**
 * Service for message reactions
 */
export const messageReactionService = {
  /**
   * Toggle like/reaction on a message
   */
  async toggleReaction(messageId: number, reactionId: number = 2) {
    return await tripGroupService.toggleMessageLike(messageId, reactionId);
  },

  /**
   * Get reactions for a message
   */
  async getMessageReactions(messageId: number) {
    return await tripGroupService.getMessageReactions(messageId);
  },

  /**
   * Get users who reacted to a message
   */
  async getMessageReactionUsers(messageId: number, reactionId?: number) {
    return await tripGroupService.getMessageReactionUsers(messageId, reactionId);
  }
};
