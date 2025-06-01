import { FindByIDQueryHandler } from './find-by-id.query';
import { FindByUsernameQueryHandler } from './find-by-username.query';
import { GetUserDetailsQueryHandler } from './get-user-details.query';
import { SearchUsersQueryHandler } from './search-users.query';
import { GetProfileStatsQueryHandler } from './get-profile-stats.query';

export const QueryHandlers = [
  FindByUsernameQueryHandler,
  FindByIDQueryHandler,
  GetUserDetailsQueryHandler,
  SearchUsersQueryHandler,
  GetProfileStatsQueryHandler,
];
