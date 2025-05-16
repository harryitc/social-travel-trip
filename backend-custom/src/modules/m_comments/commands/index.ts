import { CreateCommentCommandHandler } from './create-comment.command';
import { LikeCommentCommandHandler } from './like-comment.command';
import { ReplyCommentCommandHandler } from './reply-comment.command';

export const CommandHandlers = [
  CreateCommentCommandHandler,
  ReplyCommentCommandHandler,
  LikeCommentCommandHandler,
];
