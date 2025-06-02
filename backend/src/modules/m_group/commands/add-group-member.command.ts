import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { GroupMember } from '../models/group.model';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class AddGroupMemberCommand implements ICommand {
  constructor(
    public readonly dto: AddGroupMemberDto,
    public readonly adminUserId: number,
  ) {}
}

@CommandHandler(AddGroupMemberCommand)
export class AddGroupMemberCommandHandler
  implements ICommandHandler<AddGroupMemberCommand>
{
  private readonly logger = new Logger(AddGroupMemberCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: AddGroupMemberCommand): Promise<any> {
    const { dto, adminUserId } = command;

    // Check if the group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Verify admin permission
    const adminMembersResult = await this.repository.getGroupMembers(
      dto.group_id,
    );

    const adminMember = adminMembersResult.rows.find(
      (member) => member.user_id == adminUserId && member.role == 'admin',
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can add members');
    }

    // Check if trying to add self
    if (dto.user_id == adminUserId) {
      throw new BadRequestException('You cannot add yourself to the group');
    }

    // Check if user is already a member
    const existingMember = adminMembersResult.rows.find(
      (member) => member.user_id == dto.user_id,
    );

    if (existingMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    // Add new member
    const result = await this.repository.addGroupMember({
      group_id: dto.group_id,
      user_id: dto.user_id,
      role: dto.role || 'member',
      nickname: dto.nickname,
    });

    const newMemberData = new GroupMember(result.rows[0]);

    // Send WebSocket notification to existing group members about new member
    try {
      const existingMemberIds = adminMembersResult.rows.map((m) => m.user_id);

      this.websocketService.notifyGroupMemberJoined(
        dto.group_id,
        existingMemberIds, // Notify existing members (including admin)
        dto.user_id,
        newMemberData,
      );

      this.logger.debug(
        `📡 Sent WebSocket notification for admin adding user ${dto.user_id} to group ${dto.group_id}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send WebSocket notification for group member addition: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return newMemberData;
  }
}
