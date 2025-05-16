import { CreateGroupCommandHandler } from './create-group.command';
import { AddGroupMemberCommandHandler } from './add-group-member.command';
import { SendMessageCommandHandler } from './send-message.command';
import { ToggleMessageLikeCommandHandler } from './toggle-message-like.command';
import { UpdateGroupCommandHandler } from './update-group.command';
import { KickGroupMemberCommandHandler } from './kick-group-member.command';
import { UpdateMemberRoleCommandHandler } from './update-member-role.command';
import { AddMessagePinCommandHandler } from './add-message-pin.command';
import { RemoveMessagePinCommandHandler } from './remove-message-pin.command';

export const CommandHandlers = [
  CreateGroupCommandHandler,
  AddGroupMemberCommandHandler,
  SendMessageCommandHandler,
  ToggleMessageLikeCommandHandler,
  UpdateGroupCommandHandler,
  KickGroupMemberCommandHandler,
  UpdateMemberRoleCommandHandler,
  AddMessagePinCommandHandler,
  RemoveMessagePinCommandHandler,
];
