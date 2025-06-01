import { PostLikeEventHandler } from './post-like.event';
import { PostCommentEventHandler } from './post-comment.event';
import { CommentLikeEventHandler } from './comment-like.event';
import { NewFollowerEventHandler } from './new-follower.event';
import { CommentReplyEventHandler } from './comment-reply.event';
import { PostShareEventHandler } from './post-share.event';
import { NewPostFromFollowingEventHandler } from './new-post-from-following.event';
import { GroupInvitationEventHandler } from './group-invitation.event';
import { MiniBlogLikeEventHandler } from './mini-blog-like.event';
import { MiniBlogCommentEventHandler } from './mini-blog-comment.event';
import { MiniBlogCommentReplyEventHandler } from './mini-blog-comment-reply.event';
import { MiniBlogShareEventHandler } from './mini-blog-share.event';
import { NewMiniBlogFromFollowingEventHandler } from './new-mini-blog-from-following.event';
import { MiniBlogCommentLikeEventHandler } from './mini-blog-comment-like.event';

export const EventHandlers = [
  PostLikeEventHandler,
  PostCommentEventHandler,
  CommentLikeEventHandler,
  NewFollowerEventHandler,
  CommentReplyEventHandler,
  PostShareEventHandler,
  NewPostFromFollowingEventHandler,
  GroupInvitationEventHandler,

  // Mini blog event handlers
  MiniBlogLikeEventHandler,
  MiniBlogCommentEventHandler,
  MiniBlogCommentReplyEventHandler,
  MiniBlogCommentLikeEventHandler,
  MiniBlogShareEventHandler,
  NewMiniBlogFromFollowingEventHandler,
];
