import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

export enum WebsocketEvent {
  // Post events
  POST_CREATED = 'post:created',
  POST_UPDATED = 'post:updated',
  POST_DELETED = 'post:deleted',
  POST_LIKED = 'post:liked',
  POST_UNLIKED = 'post:unliked',
  
  // Comment events
  COMMENT_CREATED = 'comment:created',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',
  COMMENT_LIKED = 'comment:liked',
  COMMENT_UNLIKED = 'comment:unliked',
  
  // User events
  USER_FOLLOWED = 'user:followed',
  USER_UNFOLLOWED = 'user:unfollowed',
  
  // Notification events
  NOTIFICATION_CREATED = 'notification:created',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_DELETED = 'notification:deleted',
}

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Send event to a specific user
   * @param userId User ID to send the event to
   * @param event Event type
   * @param data Event data
   */
  sendToUser(userId: number, event: WebsocketEvent, data: any) {
    if (!this.server) {
      this.logger.error('WebSocket server not initialized');
      return;
    }
    
    this.logger.debug(`Sending ${event} to user ${userId}`);
    this.server.to(`user-${userId}`).emit(event, data);
  }

  /**
   * Send event to multiple users
   * @param userIds Array of user IDs to send the event to
   * @param event Event type
   * @param data Event data
   */
  sendToUsers(userIds: number[], event: WebsocketEvent, data: any) {
    if (!this.server) {
      this.logger.error('WebSocket server not initialized');
      return;
    }
    
    userIds.forEach(userId => {
      this.sendToUser(userId, event, data);
    });
  }

  /**
   * Send event to all connected clients
   * @param event Event type
   * @param data Event data
   */
  sendToAll(event: WebsocketEvent, data: any) {
    if (!this.server) {
      this.logger.error('WebSocket server not initialized');
      return;
    }
    
    this.logger.debug(`Broadcasting ${event} to all users`);
    this.server.emit(event, data);
  }

  /**
   * Send post created event to followers
   * @param authorId Author ID
   * @param followerIds Array of follower IDs
   * @param postData Post data
   */
  notifyNewPost(authorId: number, followerIds: number[], postData: any) {
    this.sendToUsers(followerIds, WebsocketEvent.POST_CREATED, {
      authorId,
      post: postData,
    });
  }

  /**
   * Send post liked event to post author
   * @param postId Post ID
   * @param postAuthorId Post author ID
   * @param likerId User ID who liked the post
   * @param likerData User data who liked the post
   */
  notifyPostLiked(postId: number, postAuthorId: number, likerId: number, likerData: any) {
    this.sendToUser(postAuthorId, WebsocketEvent.POST_LIKED, {
      postId,
      likerId,
      likerData,
    });
  }

  /**
   * Send comment created event to post author
   * @param postId Post ID
   * @param postAuthorId Post author ID
   * @param commenterId User ID who commented
   * @param commenterData User data who commented
   * @param commentData Comment data
   */
  notifyNewComment(
    postId: number,
    postAuthorId: number,
    commenterId: number,
    commenterData: any,
    commentData: any,
  ) {
    this.sendToUser(postAuthorId, WebsocketEvent.COMMENT_CREATED, {
      postId,
      commenterId,
      commenterData,
      comment: commentData,
    });
  }

  /**
   * Send follow event to followed user
   * @param followerId User ID who followed
   * @param followedId User ID who was followed
   * @param followerData User data who followed
   */
  notifyUserFollowed(followerId: number, followedId: number, followerData: any) {
    this.sendToUser(followedId, WebsocketEvent.USER_FOLLOWED, {
      followerId,
      followerData,
    });
  }
}
