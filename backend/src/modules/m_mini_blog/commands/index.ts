import { CreateMiniBlogCommandHandler } from './create-mini-blog.command';
import { UpdateMiniBlogCommandHandler } from './update-mini-blog.command';
import { DeleteMiniBlogCommandHandler } from './delete-mini-blog.command';
import { ShareMiniBlogCommandHandler } from './share-mini-blog.command';
import { UpdateShareInfoCommandHandler } from './update-share-info.command';
import { CreateShareLinkCommandHandler } from './create-share-link.command';
import { DeleteShareLinkCommandHandler } from './delete-share-link.command';
import { DeleteWithSharesCommandHandler } from './delete-with-shares.command';
import { CreateMiniBlogCommentCommandHandler } from './create-mini-blog-comment.command';
import { ReplyMiniBlogCommentCommandHandler } from './reply-mini-blog-comment.command';
import { LikeMiniBlogCommandHandler } from './like-mini-blog.command';
import { LikeMiniBlogCommentCommandHandler } from './like-mini-blog-comment.command';

export const CommandHandlers = [
  CreateMiniBlogCommandHandler,
  UpdateMiniBlogCommandHandler,
  DeleteMiniBlogCommandHandler,
  ShareMiniBlogCommandHandler,
  UpdateShareInfoCommandHandler,
  CreateShareLinkCommandHandler,
  DeleteShareLinkCommandHandler,
  DeleteWithSharesCommandHandler,
  CreateMiniBlogCommentCommandHandler,
  ReplyMiniBlogCommentCommandHandler,
  LikeMiniBlogCommandHandler,
  LikeMiniBlogCommentCommandHandler,
];
