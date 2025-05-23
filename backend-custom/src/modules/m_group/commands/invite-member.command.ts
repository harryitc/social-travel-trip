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
import { InviteMemberDto } from '../dto/invite-member.dto';
import { GroupMember } from '../models/group.model';

export class InviteMemberCommand implements ICommand {
  constructor(
    public readonly dto: InviteMemberDto,
    public readonly adminUserId: number,
  ) {}
}

@CommandHandler(InviteMemberCommand)
export class InviteMemberCommandHandler
  implements ICommandHandler<InviteMemberCommand>
{
  private readonly logger = new Logger(InviteMemberCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: InviteMemberCommand): Promise<any> {
    const { dto, adminUserId } = command;

    // Check if group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount === 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      (member) =>
        member.user_id === adminUserId &&
        (member.role === 'admin' || member.role === 'moderator'),
    );

    if (!adminMember) {
      throw new UnauthorizedException(
        'Only admin or moderator can invite members',
      );
    }

    // Find user by username or email
    const userResult = await this.repository.findUserByUsernameOrEmail(
      dto.username_or_email,
    );
    if (userResult.rowCount === 0) {
      throw new NotFoundException(
        `User with username/email "${dto.username_or_email}" not found`,
      );
    }

    const targetUser = userResult.rows[0];

    // Check if user is already a member
    const existingMember = membersResult.rows.find(
      (member) => member.user_id === targetUser.user_id,
    );

    if (existingMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    // Add user to the group
    const result = await this.repository.addGroupMember({
      group_id: dto.group_id,
      user_id: targetUser.user_id,
      role: dto.role || 'member',
      nickname: dto.nickname,
    });

    const newMember = new GroupMember(result.rows[0]);

    // TODO: Send notification to invited user
    // this.eventBus.publish(new GroupMemberInvitedEvent(...));

    return {
      success: true,
      message: `Successfully invited ${targetUser.username} to the group`,
      member: newMember,
      invited_user: {
        user_id: targetUser.user_id,
        username: targetUser.username,
        email: targetUser.email,
      },
    };
  }
}
