import Http from '@/lib/http';
import { LikesService } from '../../forum/components/likes-modal';
import { API_ENDPOINT } from '@/config/api.config';

/**
 * Adapter for message likes service
 */
export const messageLikesAdapter: LikesService = {
  async getLikes(messageId: string) {
    const response: any = await Http.post(
      `${API_ENDPOINT.social_travel_trip}/group/messages/get-reactions`,
      {
        group_message_id: parseInt(messageId)
      }
    );
    return {
      total: response.total || 0,
      reactions: response.reactions || [],
      users: response.users || []
    };
  },

  async getReactionUsers(messageId: string, reactionId?: number) {
    const response: any = await Http.post(
      `${API_ENDPOINT.social_travel_trip}/group/messages/reaction-users`,
      {
        group_message_id: parseInt(messageId),
        reaction_id: reactionId
      }
    );
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
    const response = await Http.post(
      `${API_ENDPOINT.social_travel_trip}/group/messages/like`,
      {
        group_message_id: messageId,
        reaction_id: reactionId
      }
    );
    return response;
  },

  /**
   * Get reactions for a message
   */
  async getMessageReactions(messageId: number) {
    const response: any = await Http.post(
      `${API_ENDPOINT.social_travel_trip}/group/messages/get-reactions`,
      {
        group_message_id: messageId
      }
    );
    return response;
  },

  /**
   * Get users who reacted to a message
   */
  async getMessageReactionUsers(messageId: number, reactionId?: number) {
    const response: any = await Http.post(
      `${API_ENDPOINT.social_travel_trip}/group/messages/reaction-users`,
      {
        group_message_id: messageId,
        reaction_id: reactionId
      }
    );
    return response;
  }
};
