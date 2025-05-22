import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import { UserRelaWithDetails } from '../models/user.model';
import { NotificationModel } from '@/features/notifications/models/notification.model';

/**
 * Service for handling users
 */
export const userService = {
  /**
   * Get user following
   * @returns Promise with user following
   */
  async getFollowing(): Promise<UserRelaWithDetails[]> {
    try {
      const response: any = await Http.post(
        `${API_ENDPOINT.social_travel_trip}/user-rela/get-following`,
        {
          params: {
            page: 1,
            limit: 100,
          },
        },
      );
      return response.following.map((item: UserRelaWithDetails) => new UserRelaWithDetails(item));
    } catch (error) {
      console.error('Error getting user following:', error);
      throw error;
    }
  },

  /**
   * Get user followers
   * @param userId User ID
   * @returns Promise with user followers
   */
  async getFollowers(): Promise<UserRelaWithDetails[]> {
    try {
      const response: any = await Http.post(
        `${API_ENDPOINT.social_travel_trip}/user-rela/get-followers`,
        {
          params: {
            page: 1,
            limit: 100,
          },
        },
      );
      return response.map((item: UserRelaWithDetails) => new UserRelaWithDetails(item));
    } catch (error) {
      console.error('Error getting user followers:', error);
      throw error;
    }
  },

  /**
   * Get user notifications
   * @returns Promise with user notifications
   */
  async getNotifications(): Promise<NotificationModel[]> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/notify/get`, {
        params: {
          page: 1,
          limit: 100,
        },
      });
      return response.map((item: NotificationModel) => new NotificationModel(item));
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  },

  async followUser(userId: string): Promise<{ success: boolean }> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/user-rela/follow`, {
        following_id: +userId,
      });
      return { success: true };
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  async unfollowUser(userId: string): Promise<{ success: boolean }> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/user-rela/unfollow`, {
        following_id: +userId,
      });
      return { success: true };
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  /**
   * Check if current user is following a specific user
   * @param userId User ID to check
   * @returns Promise with follow status
   */
  async checkFollowStatus(userId: string): Promise<{ isFollowing: boolean }> {
    try {
      const following = await this.getFollowing();
      const isFollowing = following.some(user => user.following.toString() === userId);
      return { isFollowing };
    } catch (error) {
      console.error('Error checking follow status:', error);
      return { isFollowing: false };
    }
  },
};
