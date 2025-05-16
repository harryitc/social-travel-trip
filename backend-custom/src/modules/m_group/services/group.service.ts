import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateGroupDto } from '../dto/create-group.dto';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { ToggleMessagePinDto } from '../dto/toggle-message-pin.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { CreateGroupCommand } from '../commands/create-group.command';
import { AddGroupMemberCommand } from '../commands/add-group-member.command';
import { SendMessageCommand } from '../commands/send-message.command';
import { ToggleMessageLikeCommand } from '../commands/toggle-message-like.command';
import { ToggleMessagePinCommand } from '../commands/toggle-message-pin.command';
import { UpdateGroupCommand } from '../commands/update-group.command';
import { GetMessagesQuery } from '../queries/get-messages.query';
import { GetPinnedMessagesQuery } from '../queries/get-pinned-messages.query';
import { GetListGroupsQuery } from '../queries/get-list-groups.query';

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

  // Member operations
  async addMember(dto: AddGroupMemberDto, userId: number) {
    return this.commandBus.execute(new AddGroupMemberCommand(dto, userId));
  }

  // Message operations
  async sendMessage(dto: SendMessageDto, userId: number) {
    return this.commandBus.execute(new SendMessageCommand(dto, userId));
  }

  async getMessages(dto: GetMessagesDto, userId: number) {
    return this.queryBus.execute(new GetMessagesQuery(dto, userId));
  }

  async toggleLike(messageId: number, userId: number) {
    const dto: ToggleMessageLikeDto = { group_message_id: messageId };
    return this.commandBus.execute(new ToggleMessageLikeCommand(dto, userId));
  }

  async togglePin(messageId: number, groupId: number, userId: number) {
    const dto: ToggleMessagePinDto = {
      group_message_id: messageId,
      group_id: groupId,
    };
    return this.commandBus.execute(new ToggleMessagePinCommand(dto, userId));
  }

  async getPinnedMessages(groupId: number, userId: number) {
    return this.queryBus.execute(new GetPinnedMessagesQuery(groupId, userId));
  }
}
