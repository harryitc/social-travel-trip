import { GetFollowersQueryHandler } from './get-followers.query';
import { GetFollowingQueryHandler } from './get-following.query';
import { CheckFollowStatusQueryHandler } from './check-follow-status.query';
import { GetAllFollowersQueryHandler } from './get-all-followers.query';

export const QueryHandlers = [
  GetFollowersQueryHandler,
  GetFollowingQueryHandler,
  CheckFollowStatusQueryHandler,
  GetAllFollowersQueryHandler,
];
