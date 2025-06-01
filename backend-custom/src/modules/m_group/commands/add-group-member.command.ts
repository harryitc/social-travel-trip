import {
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { GroupMember } from '../models/group.model';
import { UserService } from '@modules/user/user.service';
import { GroupInvitationEvent } from '@modules/m_notify/events/group-invitation.event';

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
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
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

    try {
      // Get group details for notification
      const group = groupResult.rows[0];

      // Get admin user details for notification
      const adminUser = await this.userService.findById(adminUserId);

      if (group && adminUser) {
        // Send notification to the invited user by publishing an event
        await this.eventBus.publish(
          new GroupInvitationEvent(
            dto.user_id,
            dto.group_id,
            group.name,
            adminUserId,
            adminUser.full_name || adminUser.username || 'A user',
          ),
        );
      }
    } catch (error) {
      // Log error but don't fail the member addition if notification fails
      this.logger.error(
        `Failed to create group invitation notification: ${error.message}`,
      );
    }

    return new GroupMember(result.rows[0]);
  }
}
