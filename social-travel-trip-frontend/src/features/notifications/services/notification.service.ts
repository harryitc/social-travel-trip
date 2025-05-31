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
        notify_id: notificationId,
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
   * Initialize WebSocket listeners for notifications
   * @param onNewNotification Callback when a new notification is received
   */
  initializeWebSocketListeners(onNewNotification: (notification: NotificationModel) => void): void {
    // Connect to WebSocket if not already connected
    if (!websocketService.isConnected()) {
      websocketService.connect().catch((error: unknown) => {
        console.error('Failed to connect to WebSocket for notifications:', error);
      });
    }

    // Listen for new notifications
    websocketService.on(WebsocketEvent.NOTIFICATION_CREATED, (data: any) => {
      console.log('New notification received:', data);
      const notification = new NotificationModel(data);
      onNewNotification(notification);
    });

    // Listen for follow events
    websocketService.on(WebsocketEvent.USER_FOLLOWED, (data: any) => {
      console.log('User followed event:', data);
      // The server should send a notification, but we can handle it here as well
    });

    // Listen for comment events
    websocketService.on(WebsocketEvent.COMMENT_CREATED, (data: any) => {
      console.log('Comment created event:', data);
      // The server should send a notification, but we can handle it here as well
    });

    // Listen for like events
    websocketService.on(WebsocketEvent.POST_LIKED, (data: any) => {
      console.log('Post liked event:', data);
      // The server should send a notification, but we can handle it here as well
    });

    websocketService.on(WebsocketEvent.COMMENT_LIKED, (data: any) => {
      console.log('Comment liked event:', data);
      // The server should send a notification, but we can handle it here as well
    });

    // Listen for group invite events
    websocketService.on(WebsocketEvent.GROUP_MEMBER_JOINED, (data: any) => {
      console.log('Group member joined event:', data);
      // The server should send a notification, but we can handle it here as well
    });
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
  }
};
