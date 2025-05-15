import { CreateCommentCommandHandler } from './create-comment.command';
import { CreatePostCommandHandler } from './create-post.command';
import { LikeCommentCommandHandler } from './like-comment.command';
import { LikePostCommandHandler } from './like-post.command';
import { ReplyCommentCommandHandler } from './reply-comment.command';
import { UpdatePostCommandHandler } from './update-post.command';

export const CommandHandlers = [
  CreatePostCommandHandler,
  CreateCommentCommandHandler,
  LikePostCommandHandler,
  ReplyCommentCommandHandler,
  UpdatePostCommandHandler,
  LikeCommentCommandHandler,
];
