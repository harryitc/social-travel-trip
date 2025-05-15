import { GetPostsQueryHandler } from './get-post.query';
import { GetLikesPostQueryHandler } from './get-like-post.query';
import { GetCommentByPostQueryHandler } from './get-comment-by-post-query';

export const QueryHandlers = [
  GetPostsQueryHandler,
  GetLikesPostQueryHandler,
  GetCommentByPostQueryHandler,
];
