import { PostLikeEventHandler } from './post-like.event';
import { PostCommentEventHandler } from './post-comment.event';
import { CommentLikeEventHandler } from './comment-like.event';
import { NewFollowerEventHandler } from './new-follower.event';
import { CommentReplyEventHandler } from './comment-reply.event';
import { PostShareEventHandler } from './post-share.event';
import { NewPostFromFollowingEventHandler } from './new-post-from-following.event';
import { GroupInvitationEventHandler } from './group-invitation.event';

export const EventHandlers = [
  PostLikeEventHandler,
  PostCommentEventHandler,
  CommentLikeEventHandler,
  NewFollowerEventHandler,
  CommentReplyEventHandler,
  PostShareEventHandler,
  NewPostFromFollowingEventHandler,
  GroupInvitationEventHandler,
];
