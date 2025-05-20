import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateGroupDto } from '../dto/create-group.dto';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { GetGroupMembersDto } from '../dto/get-group-members.dto';
import { GetGroupDetailsDto } from '../dto/get-group-details.dto';
import { KickGroupMemberDto } from '../dto/kick-group-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { AddMessagePinDto } from '../dto/add-message-pin.dto';
import { RemoveMessagePinDto } from '../dto/remove-message-pin.dto';
import { GetMessageReactionsDto } from '../dto/get-message-reactions.dto';
import { GenerateJoinQRCodeDto } from '../dto/generate-join-qrcode.dto';
import { JoinGroupByCodeDto } from '../dto/join-group-by-code.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { CreateGroupCommand } from '../commands/create-group.command';
import { AddGroupMemberCommand } from '../commands/add-group-member.command';
import { SendMessageCommand } from '../commands/send-message.command';
import { ToggleMessageLikeCommand } from '../commands/toggle-message-like.command';
import { AddMessagePinCommand } from '../commands/add-message-pin.command';
import { RemoveMessagePinCommand } from '../commands/remove-message-pin.command';
import { UpdateGroupCommand } from '../commands/update-group.command';
import { KickGroupMemberCommand } from '../commands/kick-group-member.command';
import { UpdateMemberRoleCommand } from '../commands/update-member-role.command';
import { GenerateJoinQRCodeCommand } from '../commands/generate-join-qrcode.command';
import { JoinGroupByCodeCommand } from '../commands/join-group-by-code.command';
import { GetMessagesQuery } from '../queries/get-messages.query';
import { GetPinnedMessagesQuery } from '../queries/get-pinned-messages.query';
import { GetListGroupsQuery } from '../queries/get-list-groups.query';
import { GetGroupMembersQuery } from '../queries/get-group-members.query';
import { GetGroupDetailsQuery } from '../queries/get-group-details.query';
import { GetMessageReactionsQuery } from '../queries/get-message-reactions.query';

@Injectable()
export class GroupService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getListGroups(userId: number) {
    return this.queryBus.execute(new GetListGroupsQuery(userId));
  }

  // Group operations
  async createGroup(dto: CreateGroupDto, userId: number) {
    return this.commandBus.execute(new CreateGroupCommand(dto, userId));
  }

  async updateGroup(dto: UpdateGroupDto, userId: number) {
    return this.commandBus.execute(new UpdateGroupCommand(dto, userId));
  }

  async getGroupDetails(dto: GetGroupDetailsDto, userId: number) {
    return this.queryBus.execute(new GetGroupDetailsQuery(dto, userId));
  }

  // Member operations
  async addMember(dto: AddGroupMemberDto, userId: number) {
    return this.commandBus.execute(new AddGroupMemberCommand(dto, userId));
  }

  async getGroupMembers(dto: GetGroupMembersDto, userId: number) {
    return this.queryBus.execute(new GetGroupMembersQuery(dto, userId));
  }

  async kickGroupMember(dto: KickGroupMemberDto, userId: number) {
    return this.commandBus.execute(new KickGroupMemberCommand(dto, userId));
  }

  async updateMemberRole(dto: UpdateMemberRoleDto, userId: number) {
    return this.commandBus.execute(new UpdateMemberRoleCommand(dto, userId));
  }

  async generateJoinQRCode(dto: GenerateJoinQRCodeDto, userId: number) {
    return this.commandBus.execute(new GenerateJoinQRCodeCommand(dto, userId));
  }

  async joinGroupByCode(dto: JoinGroupByCodeDto, userId: number) {
    return this.commandBus.execute(new JoinGroupByCodeCommand(dto, userId));
  }

  // Message operations
  async sendMessage(dto: SendMessageDto, userId: number) {
    return this.commandBus.execute(new SendMessageCommand(dto, userId));
  }

  async getMessages(dto: GetMessagesDto, userId: number) {
    return this.queryBus.execute(new GetMessagesQuery(dto, userId));
  }

  async toggleLike(dto: ToggleMessageLikeDto, userId: number) {
    return this.commandBus.execute(new ToggleMessageLikeCommand(dto, userId));
  }

  async addMessagePin(dto: AddMessagePinDto, userId: number) {
    return this.commandBus.execute(new AddMessagePinCommand(dto, userId));
  }

  async removeMessagePin(dto: RemoveMessagePinDto, userId: number) {
    return this.commandBus.execute(new RemoveMessagePinCommand(dto, userId));
  }

  async getMessageReactions(dto: GetMessageReactionsDto, userId: number) {
    return this.queryBus.execute(new GetMessageReactionsQuery(dto, userId));
  }

  async getPinnedMessages(groupId: number, userId: number) {
    return this.queryBus.execute(new GetPinnedMessagesQuery(groupId, userId));
  }
}
