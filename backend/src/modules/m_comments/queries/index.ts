import { GetCommentByPostQueryHandler } from './get-comment-by-post-query';
import { GetLikesCommentQueryHandler } from './get-likes-comment.query';
import { GetCommentReactionUsersQueryHandler } from './get-comment-reaction-users.query';

export const QueryHandlers = [
  GetCommentByPostQueryHandler,
  GetLikesCommentQueryHandler,
  GetCommentReactionUsersQueryHandler,
];
