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
}
