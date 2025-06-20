import { CreateGroupCommandHandler } from './create-group.command';
import { AddGroupMemberCommandHandler } from './add-group-member.command';
import { SendMessageCommandHandler } from './send-message.command';
import { ToggleMessageLikeCommandHandler } from './toggle-message-like.command';
import { UpdateGroupCommandHandler } from './update-group.command';
import { KickGroupMemberCommandHandler } from './kick-group-member.command';
import { LeaveGroupCommandHandler } from './leave-group.command';
import { UpdateMemberRoleCommandHandler } from './update-member-role.command';
import { UpdateMemberNicknameCommandHandler } from './update-member-nickname.command';
import { AddMessagePinCommandHandler } from './add-message-pin.command';
import { RemoveMessagePinCommandHandler } from './remove-message-pin.command';
import { GenerateJoinQRCodeCommandHandler } from './generate-join-qrcode.command';
import { JoinGroupByCodeCommandHandler } from './join-group-by-code.command';
import { InviteMemberCommandHandler } from './invite-member.command';
import { RespondInvitationCommandHandler } from './respond-invitation.command';

export const CommandHandlers = [
  CreateGroupCommandHandler,
  AddGroupMemberCommandHandler,
  SendMessageCommandHandler,
  ToggleMessageLikeCommandHandler,
  UpdateGroupCommandHandler,
  KickGroupMemberCommandHandler,
  LeaveGroupCommandHandler,
  UpdateMemberRoleCommandHandler,
  UpdateMemberNicknameCommandHandler,
  AddMessagePinCommandHandler,
  RemoveMessagePinCommandHandler,
  GenerateJoinQRCodeCommandHandler,
  JoinGroupByCodeCommandHandler,
  InviteMemberCommandHandler,
  RespondInvitationCommandHandler,
];
