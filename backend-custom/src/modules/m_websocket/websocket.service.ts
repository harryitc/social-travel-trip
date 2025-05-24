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

  // Group messaging events
  GROUP_MESSAGE_SENT = 'group:message:sent',
  GROUP_MESSAGE_LIKED = 'group:message:liked',
  GROUP_MESSAGE_UNLIKED = 'group:message:unliked',
  GROUP_MESSAGE_PINNED = 'group:message:pinned',
  GROUP_MESSAGE_UNPINNED = 'group:message:unpinned',

  // Group member events
  GROUP_MEMBER_JOINED = 'group:member:joined',
  GROUP_MEMBER_LEFT = 'group:member:left',
  GROUP_MEMBER_TYPING = 'group:member:typing',
  GROUP_MEMBER_STOP_TYPING = 'group:member:stop_typing',

  // Group events
  GROUP_UPDATED = 'group:updated',
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

    userIds.forEach((userId) => {
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
   * Send post created event to followers only
   * @param authorId Author ID
   * @param followerIds Array of follower IDs
   * @param postData Post data
   */
  notifyNewPost(authorId: number, followerIds: number[], postData: any) {
    if (!followerIds || followerIds.length === 0) {
      this.logger.debug(
        `No followers to notify for post from user ${authorId}`,
      );
      return;
    }

    this.logger.debug(
      `Notifying ${followerIds.length} followers about new post from user ${authorId}`,
    );
    this.sendToUsers(followerIds, WebsocketEvent.POST_CREATED, {
      authorId,
      post: postData,
    });
  }

  /**
   * Send post liked event to relevant users (post author and users who interacted with the post)
   * @param postId Post ID
   * @param postAuthorId Post author ID
   * @param likerId User ID who liked the post
   * @param likerData User data who liked the post
   * @param interestedUserIds Array of user IDs who have interacted with this post
   */
  notifyPostLiked(
    postId: number,
    postAuthorId: number,
    likerId: number,
    likerData: any,
    interestedUserIds: number[] = [],
  ) {
    const eventData = {
      postId,
      likerId,
      likerData,
    };

    // Always notify the post author (unless they liked their own post)
    if (postAuthorId !== likerId) {
      this.sendToUser(postAuthorId, WebsocketEvent.POST_LIKED, eventData);
    }

    // Notify other users who have interacted with this post (commented, liked, etc.)
    const uniqueInterestedUsers = [...new Set(interestedUserIds)].filter(
      (userId) => userId !== likerId && userId !== postAuthorId,
    );

    if (uniqueInterestedUsers.length > 0) {
      this.logger.debug(
        `Notifying ${uniqueInterestedUsers.length} interested users about post like`,
      );
      this.sendToUsers(
        uniqueInterestedUsers,
        WebsocketEvent.POST_LIKED,
        eventData,
      );
    }
  }

  /**
   * Send comment created event to relevant users (post author, comment thread participants)
   * @param postId Post ID
   * @param postAuthorId Post author ID
   * @param commenterId User ID who commented
   * @param commenterData User data who commented
   * @param commentData Comment data
   * @param threadParticipantIds Array of user IDs who participated in this comment thread
   */
  notifyNewComment(
    postId: number,
    postAuthorId: number,
    commenterId: number,
    commenterData: any,
    commentData: any,
    threadParticipantIds: number[] = [],
  ) {
    const eventData = {
      postId,
      commenterId,
      commenterData,
      comment: commentData,
    };

    // Always notify the post author (unless they commented on their own post)
    if (postAuthorId !== commenterId) {
      this.sendToUser(postAuthorId, WebsocketEvent.COMMENT_CREATED, eventData);
    }

    // Notify other users who participated in this comment thread
    const uniqueParticipants = [...new Set(threadParticipantIds)].filter(
      (userId) => userId !== commenterId && userId !== postAuthorId,
    );

    if (uniqueParticipants.length > 0) {
      this.logger.debug(
        `Notifying ${uniqueParticipants.length} thread participants about new comment`,
      );
      this.sendToUsers(
        uniqueParticipants,
        WebsocketEvent.COMMENT_CREATED,
        eventData,
      );
    }
  }

  /**
   * Send comment liked event to relevant users
   * @param commentId Comment ID
   * @param commentAuthorId Comment author ID
   * @param likerId User ID who liked the comment
   * @param likerData User data who liked the comment
   * @param postAuthorId Post author ID (to notify them too)
   */
  notifyCommentLiked(
    commentId: number,
    commentAuthorId: number,
    likerId: number,
    likerData: any,
    postAuthorId?: number,
  ) {
    const eventData = {
      commentId,
      likerId,
      likerData,
    };

    // Notify the comment author (unless they liked their own comment)
    if (commentAuthorId !== likerId) {
      this.sendToUser(commentAuthorId, WebsocketEvent.COMMENT_LIKED, eventData);
    }

    // Also notify the post author if different from comment author and liker
    if (
      postAuthorId &&
      postAuthorId !== commentAuthorId &&
      postAuthorId !== likerId
    ) {
      this.sendToUser(postAuthorId, WebsocketEvent.COMMENT_LIKED, eventData);
    }
  }

  /**
   * Send follow event to followed user
   * @param followerId User ID who followed
   * @param followedId User ID who was followed
   * @param followerData User data who followed
   */
  notifyUserFollowed(
    followerId: number,
    followedId: number,
    followerData: any,
  ) {
    this.sendToUser(followedId, WebsocketEvent.USER_FOLLOWED, {
      followerId,
      followerData,
    });
  }

  /**
   * Send event to all members of a group
   * @param groupId Group ID
   * @param memberIds Array of member user IDs
   * @param event Event type
   * @param data Event data
   */
  sendToGroup(
    groupId: number,
    memberIds: number[],
    event: WebsocketEvent,
    data: any,
  ) {
    if (!memberIds || memberIds.length === 0) {
      this.logger.debug(`No members to notify for group ${groupId}`);
      return;
    }

    this.logger.debug(
      `Sending ${event} to ${memberIds.length} members of group ${groupId}`,
    );
    this.sendToUsers(memberIds, event, data);
  }

  /**
   * Notify group members about new message
   * @param groupId Group ID
   * @param memberIds Array of member user IDs
   * @param senderId User ID who sent the message
   * @param messageData Message data
   */
  notifyGroupMessage(
    groupId: number,
    memberIds: number[],
    senderId: number,
    messageData: any,
  ) {
    if (!this.server) {
      this.logger.error('WebSocket server not initialized');
      return;
    }

    // Send to group room (including sender for real-time updates)
    const roomName = `group-${groupId}`;
    this.logger.debug(
      `Sending message notification to group room: ${roomName}`,
    );

    this.server.to(roomName).emit(WebsocketEvent.GROUP_MESSAGE_SENT, {
      groupId,
      senderId,
      message: messageData,
    });

    // Also send to individual users as fallback
    const recipientIds = memberIds.filter((id) => id !== senderId);
    if (recipientIds.length > 0) {
      this.sendToGroup(
        groupId,
        recipientIds,
        WebsocketEvent.GROUP_MESSAGE_SENT,
        {
          groupId,
          senderId,
          message: messageData,
        },
      );
    }
  }

  /**
   * Notify group members about message like/unlike
   * @param groupId Group ID
   * @param memberIds Array of member user IDs
   * @param messageId Message ID
   * @param likerId User ID who liked/unliked
   * @param isLiked Whether message was liked or unliked
   * @param likeCount Updated like count
   */
  notifyGroupMessageLike(
    groupId: number,
    memberIds: number[],
    messageId: number,
    likerId: number,
    isLiked: boolean,
    likeCount: number,
  ) {
    const event = isLiked
      ? WebsocketEvent.GROUP_MESSAGE_LIKED
      : WebsocketEvent.GROUP_MESSAGE_UNLIKED;

    this.sendToGroup(groupId, memberIds, event, {
      groupId,
      messageId,
      likerId,
      likeCount,
      isLiked,
    });
  }

  /**
   * Notify group members about message pin/unpin
   * @param groupId Group ID
   * @param memberIds Array of member user IDs
   * @param messageId Message ID
   * @param pinnerId User ID who pinned/unpinned
   * @param isPinned Whether message was pinned or unpinned
   */
  notifyGroupMessagePin(
    groupId: number,
    memberIds: number[],
    messageId: number,
    pinnerId: number,
    isPinned: boolean,
  ) {
    const event = isPinned
      ? WebsocketEvent.GROUP_MESSAGE_PINNED
      : WebsocketEvent.GROUP_MESSAGE_UNPINNED;

    this.sendToGroup(groupId, memberIds, event, {
      groupId,
      messageId,
      pinnerId,
      isPinned,
    });
  }

  /**
   * Notify group members about member joining
   * @param groupId Group ID
   * @param memberIds Array of current member user IDs
   * @param newMemberId User ID of new member
   * @param newMemberData New member data
   */
  notifyGroupMemberJoined(
    groupId: number,
    memberIds: number[],
    newMemberId: number,
    newMemberData: any,
  ) {
    this.sendToGroup(groupId, memberIds, WebsocketEvent.GROUP_MEMBER_JOINED, {
      groupId,
      newMemberId,
      member: newMemberData,
    });
  }

  /**
   * Notify group members about member leaving
   * @param groupId Group ID
   * @param memberIds Array of remaining member user IDs
   * @param leftMemberId User ID of member who left
   */
  notifyGroupMemberLeft(
    groupId: number,
    memberIds: number[],
    leftMemberId: number,
  ) {
    this.sendToGroup(groupId, memberIds, WebsocketEvent.GROUP_MEMBER_LEFT, {
      groupId,
      leftMemberId,
    });
  }

  /**
   * Notify group members about typing status
   * @param groupId Group ID
   * @param memberIds Array of member user IDs
   * @param typingUserId User ID who is typing
   * @param isTyping Whether user is typing or stopped typing
   */
  notifyGroupMemberTyping(
    groupId: number,
    memberIds: number[],
    typingUserId: number,
    isTyping: boolean,
  ) {
    // Don't send typing notification to the typer
    const recipientIds = memberIds.filter((id) => id !== typingUserId);

    if (recipientIds.length === 0) {
      return;
    }

    const event = isTyping
      ? WebsocketEvent.GROUP_MEMBER_TYPING
      : WebsocketEvent.GROUP_MEMBER_STOP_TYPING;

    this.sendToGroup(groupId, recipientIds, event, {
      groupId,
      typingUserId,
      isTyping,
    });
  }

  /**
   * Send notification event to specific user
   * @param userId User ID to notify
   * @param notificationData Notification data
   */
  notifyUser(userId: number, notificationData: any) {
    this.sendToUser(
      userId,
      WebsocketEvent.NOTIFICATION_CREATED,
      notificationData,
    );
  }

  /**
   * Get connected users count for debugging
   */
  getConnectedUsersCount(): number {
    if (!this.server) {
      return 0;
    }
    return this.server.sockets.sockets.size;
  }

  /**
   * Check if a specific user is connected
   * @param userId User ID to check
   */
  isUserConnected(userId: number): boolean {
    if (!this.server) {
      return false;
    }

    const room = this.server.sockets.adapter.rooms.get(`user-${userId}`);
    return room && room.size > 0;
  }
}
