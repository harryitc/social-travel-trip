import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import { NotificationModel } from '../models/notification.model';
import { WebsocketEvent, websocketService } from '@/lib/services/websocket.service';

/**
 * Notification types
 * Matches backend NotificationType enum
 */
export enum NotificationType {
  // User notifications
  NEW_FOLLOWER = 'new_follower',
  GROUP_INVITATION = 'group_invitation',
  
  // Post notifications
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  POST_COMMENT_LIKE = 'post_comment_like',
  POST_SHARE = 'post_share',
  COMMENT_REPLY = 'comment_reply',
  NEW_POST_FROM_FOLLOWING = 'new_post_from_following',
  
  // Mini blog notifications
  MINI_BLOG_LIKE = 'mini_blog_like',
  MINI_BLOG_COMMENT = 'mini_blog_comment',
  MINI_BLOG_COMMENT_REPLY = 'mini_blog_comment_reply',
  MINI_BLOG_COMMENT_LIKE = 'mini_blog_comment_like',
  MINI_BLOG_SHARE = 'mini_blog_share',
  NEW_MINI_BLOG_FROM_FOLLOWING = 'new_mini_blog_from_following',
}

/**
 * Service for handling notifications
 */
export const notificationService = {
  /**
   * Get user notifications
   * @returns Promise with user notifications
   */
  async getNotifications(): Promise<NotificationModel[]> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/notify/query`, {
        params: {
          page: 1,
          limit: 100,
        },
      });
      return response.data.map((item: any) => new NotificationModel(item));
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param notificationId Notification ID
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/notify/mark-read`, {
        notify_id: +notificationId,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      // Use the new backend API endpoint to mark all notifications as read in a single request
      await Http.post(`${API_ENDPOINT.social_travel_trip}/notify/mark-all-read`, {});
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Get formatted notification message based on type
   * @param notification Notification object
   * @returns Formatted message
   */
  getFormattedMessage(notification: NotificationModel): string {
    const { type, json_data } = notification;
    
    // If the backend already provided a formatted message, use it
    if (json_data?.message) {
      return json_data.message;
    }
    
    switch (type) {
      case NotificationType.NEW_FOLLOWER:
        return `${json_data.follower_name || 'Ai đó'} đã bắt đầu theo dõi bạn`;
      
      case NotificationType.GROUP_INVITATION:
        return `${json_data.user_name || 'Ai đó'} đã mời bạn vào nhóm ${json_data.group_name || ''}`;
      
      case NotificationType.POST_COMMENT:
        return `${json_data.commenter_name || 'Ai đó'} đã bình luận về bài viết của bạn`;
      
      case NotificationType.COMMENT_REPLY:
        return `${json_data.commenter_name || 'Ai đó'} đã trả lời bình luận của bạn`;
      
      case NotificationType.POST_LIKE:
        return `${json_data.liker_name || 'Ai đó'} đã thích bài viết của bạn`;
      
      case NotificationType.POST_COMMENT_LIKE:
        return `${json_data.liker_name || 'Ai đó'} đã thích bình luận của bạn`;
      
      case NotificationType.MINI_BLOG_LIKE:
        return `${json_data.liker_name || 'Ai đó'} đã thích mini blog của bạn`;
      
      case NotificationType.MINI_BLOG_COMMENT:
        return `${json_data.commenter_name || 'Ai đó'} đã bình luận về mini blog của bạn`;
      
      case NotificationType.MINI_BLOG_COMMENT_REPLY:
        return `${json_data.commenter_name || 'Ai đó'} đã trả lời bình luận mini blog của bạn`;
      
      case NotificationType.MINI_BLOG_COMMENT_LIKE:
        return `${json_data.liker_name || 'Ai đó'} đã thích bình luận mini blog của bạn`;
      
      case NotificationType.NEW_POST_FROM_FOLLOWING:
        return `${json_data.creator_name || 'Ai đó'} đã đăng bài viết mới`;
      
      case NotificationType.NEW_MINI_BLOG_FROM_FOLLOWING:
        return `${json_data.creator_name || 'Ai đó'} đã đăng mini blog mới`;
      
      case NotificationType.POST_SHARE:
        return `${json_data.sharer_name || 'Ai đó'} đã chia sẻ bài viết của bạn`;
      
      case NotificationType.MINI_BLOG_SHARE:
        return `${json_data.sharer_name || 'Ai đó'} đã chia sẻ mini blog của bạn`;
      
      default:
        return 'Bạn có thông báo mới';
    }
  },

  /**
   * Get notification URL to navigate to
   * @param notification Notification object
   * @returns URL to navigate to
   */
  getNotificationUrl(notification: NotificationModel): string {
    const { type, json_data } = notification;
    
    switch (type) {
      case NotificationType.NEW_FOLLOWER:
        return `/profile/${json_data.follower_id}`;
      
      case NotificationType.GROUP_INVITATION:
        return `/groups/${json_data.group_id}`;
      
      // Post related notifications
      case NotificationType.POST_COMMENT:
      case NotificationType.POST_LIKE:
      case NotificationType.POST_SHARE:
        return `/posts/${json_data.post_id}`;
      
      case NotificationType.COMMENT_REPLY:
      case NotificationType.POST_COMMENT_LIKE:
        return `/posts/${json_data.post_id}#comment-${json_data.comment_id}`;
      
      // Mini blog related notifications
      case NotificationType.MINI_BLOG_LIKE:
      case NotificationType.MINI_BLOG_COMMENT:
      case NotificationType.MINI_BLOG_SHARE:
        return `/mini-blogs/${json_data.mini_blog_id}`;
      
      case NotificationType.MINI_BLOG_COMMENT_REPLY:
      case NotificationType.MINI_BLOG_COMMENT_LIKE:
        return `/mini-blogs/${json_data.mini_blog_id}#comment-${json_data.comment_id}`;
      
      // New content from following
      case NotificationType.NEW_POST_FROM_FOLLOWING:
        return `/posts/${json_data.post_id}`;
      
      case NotificationType.NEW_MINI_BLOG_FROM_FOLLOWING:
        return `/mini-blogs/${json_data.mini_blog_id}`;
      
      default:
        return '#';
    }
  },

  /**
   * Handle notification action (Accept/Decline invitation, etc.)
   * @param action Action object from notification
   * @returns Promise with action result
   */
  async handleNotificationAction(action: any): Promise<any> {
    try {
      const endpoint = `${API_ENDPOINT.social_travel_trip}${action.api_endpoint}`;
      const response = await Http.post(endpoint, action.payload);
      return response;
    } catch (error) {
      console.error('Error handling notification action:', error);
      throw error;
    }
  },

  /**
   * Check if notification has actions
   * @param notification Notification object
   * @returns Boolean indicating if notification has actions
   */
  hasActions(notification: NotificationModel): boolean {
    return notification.json_data?.actions && Array.isArray(notification.json_data.actions) && notification.json_data.actions.length > 0;
  },

  /**
   * Get notification actions
   * @param notification Notification object
   * @returns Array of actions or empty array
   */
  getActions(notification: NotificationModel): any[] {
    return notification.json_data?.actions || [];
  }
};
