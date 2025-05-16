import { CreateGroupCommandHandler } from './create-group.command';
import { AddGroupMemberCommandHandler } from './add-group-member.command';
import { SendMessageCommandHandler } from './send-message.command';
import { ToggleMessageLikeCommandHandler } from './toggle-message-like.command';
import { ToggleMessagePinCommandHandler } from './toggle-message-pin.command';
import { UpdateGroupCommandHandler } from './update-group.command';

export const CommandHandlers = [
  CreateGroupCommandHandler,
  AddGroupMemberCommandHandler,
  SendMessageCommandHandler,
  ToggleMessageLikeCommandHandler,
  ToggleMessagePinCommandHandler,
  UpdateGroupCommandHandler,
];
