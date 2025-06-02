import { GetPostsQueryHandler } from './get-post.query';
import { GetLikesPostQueryHandler } from './get-like-post.query';
import { GetPostDetailQueryHandler } from './get-post-detail.query';
import { GetPostReactionUsersQueryHandler } from './get-post-reaction-users.query';

export const QueryHandlers = [
  GetPostsQueryHandler,
  GetLikesPostQueryHandler,
  GetPostDetailQueryHandler,
  GetPostReactionUsersQueryHandler,
];
