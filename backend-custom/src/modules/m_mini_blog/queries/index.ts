import { GetMiniBlogsQueryHandler } from './get-mini-blogs.query';
import { GetMiniBlogByIdQueryHandler } from './get-mini-blog-by-id.query';
import { GetSharesListQueryHandler } from './get-shares-list.query';

export const QueryHandlers = [
  GetMiniBlogsQueryHandler,
  GetMiniBlogByIdQueryHandler,
  GetSharesListQueryHandler,
];
