import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { PostLikeEvent } from '../events/post-like.event';
import { PostCommentEvent } from '../events/post-comment.event';
import { NewFollowerEvent } from '../events/new-follower.event';
import { CommentReplyEvent } from '../events/comment-reply.event';
import { PostShareEvent } from '../events/post-share.event';
import { NewPostFromFollowingEvent } from '../events/new-post-from-following.event';
import { GroupInvitationEvent } from '../events/group-invitation.event';

/**
 * Service to handle notification events from other modules
 */
@Injectable()
export class NotificationEventsService {
  private readonly logger = new Logger(NotificationEventsService.name);

  constructor(private readonly eventBus: EventBus) {}

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
    this.logger.debug(`Publishing NewFollowerEvent for user ${userId}`);

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new NewFollowerEvent(userId, followerId, followerName),
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
    this.logger.debug(
      `Publishing NewPostFromFollowingEvent for ${followerIds.length} followers`,
    );

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new NewPostFromFollowingEvent(
        followerIds,
        postId,
        postCreatorId,
        postCreatorName,
      ),
    );
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
    this.logger.debug(`Publishing PostLikeEvent for post ${postId}`);

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new PostLikeEvent(postOwnerId, postId, likerId, likerName),
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
    this.logger.debug(`Publishing PostCommentEvent for post ${postId}`);

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new PostCommentEvent(
        postOwnerId,
        postId,
        commentId,
        commenterId,
        commenterName,
      ),
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
    this.logger.debug(`Publishing PostShareEvent for post ${postId}`);

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new PostShareEvent(postOwnerId, postId, sharerId, sharerName),
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
    this.logger.debug(`Publishing CommentReplyEvent for comment ${commentId}`);

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new CommentReplyEvent(
        commentOwnerId,
        postId,
        commentId,
        replyId,
        replierId,
        replierName,
      ),
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
    this.logger.debug(
      `Publishing GroupInvitationEvent for user ${invitedUserId}`,
    );

    // Publish event instead of executing command directly
    return this.eventBus.publish(
      new GroupInvitationEvent(
        invitedUserId,
        groupId,
        groupName,
        inviterId,
        inviterName,
      ),
    );
  }
}
