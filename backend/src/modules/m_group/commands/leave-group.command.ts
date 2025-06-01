import {
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { LeaveGroupDto } from '../dto/leave-group.dto';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class LeaveGroupCommand implements ICommand {
  constructor(
    public readonly dto: LeaveGroupDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LeaveGroupCommand)
export class LeaveGroupCommandHandler
  implements ICommandHandler<LeaveGroupCommand>
{
  private readonly logger = new Logger(LeaveGroupCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: LeaveGroupCommand): Promise<any> {
    const { dto, userId } = command;

    // Check if the group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Get group members to verify user membership and role
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    
    const userMember = membersResult.rows.find(
      (member) => member.user_id == userId,
    );

    if (!userMember) {
      throw new NotFoundException('You are not a member of this group');
    }

    // Prevent admin from leaving their own group
    if (userMember.role == 'admin') {
      throw new BadRequestException('Admin cannot leave the group. Please transfer admin role to another member first.');
    }

    // Remove the user from the group
    const result = await this.repository.kickGroupMember(
      dto.group_id,
      userId,
    );

    // Send WebSocket notification to remaining group members about member leaving
    try {
      // Get remaining members after the user left
      const remainingMembersResult = await this.repository.getGroupMembers(dto.group_id);
      const remainingMemberIds = remainingMembersResult.rows.map((m) => m.user_id);

      this.websocketService.notifyGroupMemberLeft(
        dto.group_id,
        remainingMemberIds, // Notify remaining members
        userId, // User who left
      );

      this.logger.debug(
        `📡 Sent WebSocket notification for user ${userId} leaving group ${dto.group_id}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send WebSocket notification for group leave: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return {
      success: result.rowCount > 0,
      message: 'You have successfully left the group',
      data: result.rows[0],
    };
  }
}
