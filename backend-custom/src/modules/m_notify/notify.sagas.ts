import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable, mergeMap } from 'rxjs';
import { CreateNotifyCommand } from './commands/create-notify.command';
import { NotificationType } from './constants/notify-types.constant';
import { PostLikeEvent } from './events/post-like.event';
import { PostCommentEvent } from './events/post-comment.event';
import { NewFollowerEvent } from './events/new-follower.event';
import { CommentReplyEvent } from './events/comment-reply.event';
import { PostShareEvent } from './events/post-share.event';
import { NewPostFromFollowingEvent } from './events/new-post-from-following.event';
import { GroupInvitationEvent } from './events/group-invitation.event';
import { MiniBlogLikeEvent } from './events/mini-blog-like.event';
import { MiniBlogCommentEvent } from './events/mini-blog-comment.event';
import { MiniBlogCommentReplyEvent } from './events/mini-blog-comment-reply.event';
import { MiniBlogCommentLikeEvent } from './events/mini-blog-comment-like.event';
import { MiniBlogShareEvent } from './events/mini-blog-share.event';
import { NewMiniBlogFromFollowingEvent } from './events/new-mini-blog-from-following.event';

@Injectable()
export class NotifySagas {
  private readonly logger = new Logger(NotifySagas.name);

  /**
   * Saga to handle post like events and create notifications
   */
  @Saga()
  postLikeEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PostLikeEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing PostLikeEvent in saga`);

        const notificationData = {
          type: NotificationType.POST_LIKE,
          json_data: {
            post_id: event.postId,
            liker_id: event.likerId,
            liker_name: event.likerName,
            message: `${event.likerName} liked your post`,
          },
        };

        return [new CreateNotifyCommand(notificationData, event.postOwnerId)];
      }),
    );
  };

  /**
   * Saga to handle post comment events and create notifications
   */
  @Saga()
  postCommentEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PostCommentEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing PostCommentEvent in saga`);

        const notificationData = {
          type: NotificationType.POST_COMMENT,
          json_data: {
            post_id: event.postId,
            comment_id: event.commentId,
            commenter_id: event.commenterId,
            commenter_name: event.commenterName,
            message: `${event.commenterName} commented on your post`,
          },
        };

        return [new CreateNotifyCommand(notificationData, event.postOwnerId)];
      }),
    );
  };

  /**
   * Saga to handle new follower events and create notifications
   */
  @Saga()
  newFollowerEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(NewFollowerEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing NewFollowerEvent in saga`);

        const notificationData = {
          type: NotificationType.NEW_FOLLOWER,
          json_data: {
            follower_id: event.followerId,
            follower_name: event.followerName,
            message: `${event.followerName} started following you`,
          },
        };

        return [new CreateNotifyCommand(notificationData, event.userId)];
      }),
    );
  };

  /**
   * Saga to handle comment reply events and create notifications
   */
  @Saga()
  commentReplyEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(CommentReplyEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing CommentReplyEvent in saga`);

        const notificationData = {
          type: NotificationType.COMMENT_REPLY,
          json_data: {
            post_id: event.postId,
            comment_id: event.commentId,
            reply_id: event.replyId,
            replier_id: event.replierId,
            replier_name: event.replierName,
            message: `${event.replierName} replied to your comment`,
          },
        };

        return [
          new CreateNotifyCommand(notificationData, event.commentOwnerId),
        ];
      }),
    );
  };

  /**
   * Saga to handle post share events and create notifications
   */
  @Saga()
  postShareEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PostShareEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing PostShareEvent in saga`);

        const notificationData = {
          type: NotificationType.POST_SHARE,
          json_data: {
            post_id: event.postId,
            sharer_id: event.sharerId,
            sharer_name: event.sharerName,
            message: `${event.sharerName} shared your post`,
          },
        };

        return [new CreateNotifyCommand(notificationData, event.postOwnerId)];
      }),
    );
  };

  /**
   * Saga to handle new post from following events and create notifications
   */
  @Saga()
  newPostFromFollowingEvent = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(NewPostFromFollowingEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing NewPostFromFollowingEvent in saga`);

        // Create a notification for each follower
        const commands = event.followerIds.map((followerId) => {
          const notificationData = {
            type: NotificationType.NEW_POST_FROM_FOLLOWING,
            json_data: {
              post_id: event.postId,
              post_creator_id: event.postCreatorId,
              post_creator_name: event.postCreatorName,
              message: `${event.postCreatorName} published a new post`,
            },
          };

          return new CreateNotifyCommand(notificationData, followerId);
        });

        return commands;
      }),
    );
  };

  /**
   * Saga to handle group invitation events and create notifications
   */
  @Saga()
  groupInvitationEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(GroupInvitationEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing GroupInvitationEvent in saga`);

        const notificationData = {
          type: NotificationType.GROUP_INVITATION,
          json_data: {
            group_id: event.groupId,
            group_name: event.groupName,
            inviter_id: event.inviterId,
            inviter_name: event.inviterName,
            message: `${event.inviterName} invited you to join the group "${event.groupName}"`,
          },
        };

        return [new CreateNotifyCommand(notificationData, event.invitedUserId)];
      }),
    );
  };

  /**
   * Saga to handle mini blog like events and create notifications
   */
  @Saga()
  miniBlogLikeEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MiniBlogLikeEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing MiniBlogLikeEvent in saga`);

        const notificationData = {
          type: NotificationType.MINI_BLOG_LIKE,
          json_data: {
            mini_blog_id: event.miniBlogId,
            liker_id: event.likerId,
            liker_name: event.likerName,
            message: `${event.likerName} liked your mini blog`,
          },
        };

        return [
          new CreateNotifyCommand(notificationData, event.miniBlogOwnerId),
        ];
      }),
    );
  };

  /**
   * Saga to handle mini blog comment events and create notifications
   */
  @Saga()
  miniBlogCommentEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MiniBlogCommentEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing MiniBlogCommentEvent in saga`);

        const notificationData = {
          type: NotificationType.MINI_BLOG_COMMENT,
          json_data: {
            mini_blog_id: event.miniBlogId,
            comment_id: event.commentId,
            commenter_id: event.commenterId,
            commenter_name: event.commenterName,
            message: `${event.commenterName} commented on your mini blog`,
          },
        };

        return [
          new CreateNotifyCommand(notificationData, event.miniBlogOwnerId),
        ];
      }),
    );
  };

  /**
   * Saga to handle mini blog comment reply events and create notifications
   */
  @Saga()
  miniBlogCommentReplyEvent = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(MiniBlogCommentReplyEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing MiniBlogCommentReplyEvent in saga`);

        const notificationData = {
          type: NotificationType.MINI_BLOG_COMMENT_REPLY,
          json_data: {
            mini_blog_id: event.miniBlogId,
            comment_id: event.commentId,
            reply_id: event.replyId,
            replier_id: event.replierId,
            replier_name: event.replierName,
            message: `${event.replierName} replied to your comment on a mini blog`,
          },
        };

        return [
          new CreateNotifyCommand(notificationData, event.commentOwnerId),
        ];
      }),
    );
  };

  /**
   * Saga to handle mini blog share events and create notifications
   */
  @Saga()
  miniBlogShareEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MiniBlogShareEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing MiniBlogShareEvent in saga`);

        const notificationData = {
          type: NotificationType.MINI_BLOG_SHARE,
          json_data: {
            mini_blog_id: event.miniBlogId,
            sharer_id: event.sharerId,
            sharer_name: event.sharerName,
            platform: event.platform,
            message: `${event.sharerName} shared your mini blog on ${event.platform}`,
          },
        };

        return [
          new CreateNotifyCommand(notificationData, event.miniBlogOwnerId),
        ];
      }),
    );
  };

  /**
   * Saga to handle new mini blog from following events and create notifications
   */
  @Saga()
  newMiniBlogFromFollowingEvent = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(NewMiniBlogFromFollowingEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing NewMiniBlogFromFollowingEvent in saga`);

        // Create a notification for each follower
        const commands = event.followerIds.map((followerId) => {
          const notificationData = {
            type: NotificationType.NEW_MINI_BLOG_FROM_FOLLOWING,
            json_data: {
              mini_blog_id: event.miniBlogId,
              mini_blog_creator_id: event.miniBlogCreatorId,
              mini_blog_creator_name: event.miniBlogCreatorName,
              message: `${event.miniBlogCreatorName} published a new mini blog`,
            },
          };

          return new CreateNotifyCommand(notificationData, followerId);
        });

        return commands;
      }),
    );
  };

  /**
   * Saga to handle mini blog comment like events and create notifications
   */
  @Saga()
  miniBlogCommentLikeEvent = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(MiniBlogCommentLikeEvent),
      mergeMap((event) => {
        this.logger.debug(`Processing MiniBlogCommentLikeEvent in saga`);

        const notificationData = {
          type: NotificationType.MINI_BLOG_COMMENT_LIKE,
          json_data: {
            mini_blog_id: event.miniBlogId,
            comment_id: event.commentId,
            liker_id: event.likerId,
            liker_name: event.likerName,
            message: `${event.likerName} liked your comment on a mini blog`,
          },
        };

        return [
          new CreateNotifyCommand(notificationData, event.commentOwnerId),
        ];
      }),
    );
  };
}
