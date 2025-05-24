import { CreateGroupCommandHandler } from './create-group.command';
import { AddGroupMemberCommandHandler } from './add-group-member.command';
import { SendMessageCommandHandler } from './send-message.command';
import { ToggleMessageLikeCommandHandler } from './toggle-message-like.command';
import { UpdateGroupCommandHandler } from './update-group.command';
import { KickGroupMemberCommandHandler } from './kick-group-member.command';
import { UpdateMemberRoleCommandHandler } from './update-member-role.command';
import { UpdateMemberNicknameCommandHandler } from './update-member-nickname.command';
import { AddMessagePinCommandHandler } from './add-message-pin.command';
import { RemoveMessagePinCommandHandler } from './remove-message-pin.command';
import { GenerateJoinQRCodeCommandHandler } from './generate-join-qrcode.command';
import { JoinGroupByCodeCommandHandler } from './join-group-by-code.command';
import { InviteMemberCommandHandler } from './invite-member.command';

export const CommandHandlers = [
  CreateGroupCommandHandler,
  AddGroupMemberCommandHandler,
  SendMessageCommandHandler,
  ToggleMessageLikeCommandHandler,
  UpdateGroupCommandHandler,
  KickGroupMemberCommandHandler,
  UpdateMemberRoleCommandHandler,
  UpdateMemberNicknameCommandHandler,
  AddMessagePinCommandHandler,
  RemoveMessagePinCommandHandler,
  GenerateJoinQRCodeCommandHandler,
  JoinGroupByCodeCommandHandler,
  InviteMemberCommandHandler,
];
