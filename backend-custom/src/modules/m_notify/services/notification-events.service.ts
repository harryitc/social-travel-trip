import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotifyCommand } from '../commands/create-notify.command';
import { NotificationType } from '../constants/notify-types.constant';

/**
 * Service to handle notification events from other modules
 */
@Injectable()
export class NotificationEventsService {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Create a notification for a new follower
   * @param userId User ID who will receive the notification
   * @param followerId User ID who followed
   * @param followerName Name of the follower
   */
  async notifyNewFollower(
    userId: number,
    followerId: number,
    followerName: string,
  ) {
    const notificationData = {
      type: NotificationType.NEW_FOLLOWER,
      json_data: {
        follower_id: followerId,
        follower_name: followerName,
        message: `${followerName} started following you`,
      },
    };

    return this.commandBus.execute(
      new CreateNotifyCommand(notificationData, userId),
    );
  }

  /**
   * Create a notification for a new post from someone the user follows
   * @param followerIds Array of follower user IDs who will receive the notification
   * @param postId Post ID
   * @param postCreatorId User ID who created the post
   * @param postCreatorName Name of the post creator
   */
  async notifyNewPostFromFollowing(
    followerIds: number[],
    postId: number,
    postCreatorId: number,
    postCreatorName: string,
  ) {
    const notificationPromises = followerIds.map((followerId) => {
      const notificationData = {
        type: NotificationType.NEW_POST_FROM_FOLLOWING,
        json_data: {
          post_id: postId,
          post_creator_id: postCreatorId,
          post_creator_name: postCreatorName,
          message: `${postCreatorName} published a new post`,
        },
      };

      return this.commandBus.execute(
        new CreateNotifyCommand(notificationData, followerId),
      );
    });

    return Promise.all(notificationPromises);
  }

  /**
   * Create a notification for a post like
   * @param postOwnerId User ID who will receive the notification (post owner)
   * @param postId Post ID
   * @param likerId User ID who liked the post
   * @param likerName Name of the user who liked the post
   */
  async notifyPostLike(
    postOwnerId: number,
    postId: number,
    likerId: number,
    likerName: string,
  ) {
    const notificationData = {
      type: NotificationType.POST_LIKE,
      json_data: {
        post_id: postId,
        liker_id: likerId,
        liker_name: likerName,
        message: `${likerName} liked your post`,
      },
    };

    return this.commandBus.execute(
      new CreateNotifyCommand(notificationData, postOwnerId),
    );
  }

  /**
   * Create a notification for a post comment
   * @param postOwnerId User ID who will receive the notification (post owner)
   * @param postId Post ID
   * @param commentId Comment ID
   * @param commenterId User ID who commented
   * @param commenterName Name of the commenter
   */
  async notifyPostComment(
    postOwnerId: number,
    postId: number,
    commentId: number,
    commenterId: number,
    commenterName: string,
  ) {
    const notificationData = {
      type: NotificationType.POST_COMMENT,
      json_data: {
        post_id: postId,
        comment_id: commentId,
        commenter_id: commenterId,
        commenter_name: commenterName,
        message: `${commenterName} commented on your post`,
      },
    };

    return this.commandBus.execute(
      new CreateNotifyCommand(notificationData, postOwnerId),
    );
  }

  /**
   * Create a notification for a post share
   * @param postOwnerId User ID who will receive the notification (post owner)
   * @param postId Post ID
   * @param sharerId User ID who shared the post
   * @param sharerName Name of the user who shared the post
   */
  async notifyPostShare(
    postOwnerId: number,
    postId: number,
    sharerId: number,
    sharerName: string,
  ) {
    const notificationData = {
      type: NotificationType.POST_SHARE,
      json_data: {
        post_id: postId,
        sharer_id: sharerId,
        sharer_name: sharerName,
        message: `${sharerName} shared your post`,
      },
    };

    return this.commandBus.execute(
      new CreateNotifyCommand(notificationData, postOwnerId),
    );
  }

  /**
   * Create a notification for a comment reply
   * @param commentOwnerId User ID who will receive the notification (comment owner)
   * @param postId Post ID
   * @param commentId Comment ID
   * @param replyId Reply ID
   * @param replierId User ID who replied
   * @param replierName Name of the user who replied
   */
  async notifyCommentReply(
    commentOwnerId: number,
    postId: number,
    commentId: number,
    replyId: number,
    replierId: number,
    replierName: string,
  ) {
    const notificationData = {
      type: NotificationType.COMMENT_REPLY,
      json_data: {
        post_id: postId,
        comment_id: commentId,
        reply_id: replyId,
        replier_id: replierId,
        replier_name: replierName,
        message: `${replierName} replied to your comment`,
      },
    };

    return this.commandBus.execute(
      new CreateNotifyCommand(notificationData, commentOwnerId),
    );
  }

  /**
   * Create a notification for a group invitation
   * @param invitedUserId User ID who will receive the notification (invited user)
   * @param groupId Group ID
   * @param groupName Name of the group
   * @param inviterId User ID who invited the user
   * @param inviterName Name of the user who invited
   */
  async notifyGroupInvitation(
    invitedUserId: number,
    groupId: number,
    groupName: string,
    inviterId: number,
    inviterName: string,
  ) {
    const notificationData = {
      type: NotificationType.GROUP_INVITATION,
      json_data: {
        group_id: groupId,
        group_name: groupName,
        inviter_id: inviterId,
        inviter_name: inviterName,
        message: `${inviterName} invited you to join the group "${groupName}"`,
      },
    };

    return this.commandBus.execute(
      new CreateNotifyCommand(notificationData, invitedUserId),
    );
  }
}
