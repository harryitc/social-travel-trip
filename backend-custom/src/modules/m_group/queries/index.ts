import { GetListGroupsQueryHandler } from './get-list-groups.query';
import { GetMessagesQueryHandler } from './get-messages.query';
import { GetPinnedMessagesQueryHandler } from './get-pinned-messages.query';
import { GetGroupMembersQueryHandler } from './get-group-members.query';
import { GetGroupDetailsQueryHandler } from './get-group-details.query';

export const QueryHandlers = [
  GetMessagesQueryHandler,
  GetPinnedMessagesQueryHandler,
  GetListGroupsQueryHandler,
  GetGroupMembersQueryHandler,
  GetGroupDetailsQueryHandler,
];
