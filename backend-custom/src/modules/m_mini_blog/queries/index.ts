import { GetMiniBlogsQueryHandler } from './get-mini-blogs.query';
import { GetMiniBlogByIdQueryHandler } from './get-mini-blog-by-id.query';
import { GetSharesListQueryHandler } from './get-shares-list.query';
import { GetMiniBlogCommentsQueryHandler } from './get-mini-blog-comments.query';
import { GetMiniBlogLikesQueryHandler } from './get-mini-blog-likes.query';
import { GetMiniBlogCommentLikesQueryHandler } from './get-mini-blog-comment-likes.query';

export const QueryHandlers = [
  GetMiniBlogsQueryHandler,
  GetMiniBlogByIdQueryHandler,
  GetSharesListQueryHandler,
  GetMiniBlogCommentsQueryHandler,
  GetMiniBlogLikesQueryHandler,
  GetMiniBlogCommentLikesQueryHandler,
];
