import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { JoinGroupByCodeDto } from '../dto/join-group-by-code.dto';
import { GroupMember } from '../models/group.model';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class JoinGroupByCodeCommand implements ICommand {
  constructor(
    public readonly dto: JoinGroupByCodeDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(JoinGroupByCodeCommand)
export class JoinGroupByCodeCommandHandler
  implements ICommandHandler<JoinGroupByCodeCommand>
{
  private readonly logger = new Logger(JoinGroupByCodeCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: JoinGroupByCodeCommand): Promise<any> {
    const { dto, userId } = command;

    // Find group by join code
    const groupResult = await this.repository.getGroupByJoinCode(dto.join_code);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException('Invalid or expired join code');
    }

    const group = groupResult.rows[0];

    // Check if join code is expired
    if (
      group.join_code_expires_at &&
      new Date(group.join_code_expires_at) < new Date()
    ) {
      // Invalidate the expired code
      await this.repository.invalidateJoinCode(group.group_id);
      throw new BadRequestException('Join code has expired');
    }

    // Check if user is already a member
    const initialMembersResult = await this.repository.getGroupMembers(group.group_id);
    const existingMember = initialMembersResult.rows.find(
      (member) => member.user_id == userId,
    );

    if (existingMember) {
      throw new BadRequestException('You are already a member of this group');
    }

    // Add user to the group as a regular member (nickname will default to username)
    const result = await this.repository.addGroupMember({
      group_id: group.group_id,
      user_id: userId,
      role: 'member',
      nickname: undefined, // Let the repository set default nickname to username
    });

    // Get updated member count
    const updatedMembersResult = await this.repository.getGroupMembers(group.group_id);
    const memberCount = updatedMembersResult.rowCount;

    // Return full group information for frontend
    const response = {
      group_id: group.group_id,
      name: group.name,
      title: group.name, // Add title field for frontend compatibility
      description: group.description,
      cover_url: group.cover_url,
      status: group.status,
      json_data: group.json_data,
      created_at: group.created_at,
      updated_at: group.updated_at,
      plan_id: group.plan_id,
      join_code: group.join_code,
      join_code_expires_at: group.join_code_expires_at,
      members: {
        count: memberCount,
        max: 10,
        list: []
      },
      // Additional response info
      success: true,
      message: `Successfully joined group: ${group.name}`,
      member: new GroupMember(result.rows[0]),
    };

    this.logger.debug(`✅ User ${userId} successfully joined group ${group.group_id} (${group.name})`);
    this.logger.debug(`📤 Returning response:`, JSON.stringify({
      group_id: response.group_id,
      name: response.name,
      title: response.title,
      memberCount: response.members.count,
      success: response.success
    }));

    // Send WebSocket notification to all group members (including the new member)
    try {
      const allMemberIds = [...initialMembersResult.rows.map((m) => m.user_id), userId];
      const newMemberData = new GroupMember(result.rows[0]);

      this.websocketService.notifyGroupMemberJoined(
        group.group_id,
        allMemberIds, // Notify all members (including the new member)
        userId,
        newMemberData,
      );

      this.logger.debug(
        `📡 Sent WebSocket notification for user ${userId} joining group ${group.group_id} to ${allMemberIds.length} members`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send WebSocket notification for group join: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return response;
  }
}
