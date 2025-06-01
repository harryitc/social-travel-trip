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
import { GroupInvitation } from '../models/group-invitation.model';
import { UserService } from '@modules/user/user.service';
import { GroupInvitationEvent } from '@modules/m_notify/events/group-invitation.event';

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
    private readonly userService: UserService,
  ) {}

  async execute(command: InviteMemberCommand): Promise<any> {
    const { dto, adminUserId } = command;

    // Check if group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      (member) =>
        member.user_id == adminUserId &&
        (member.role == 'admin' || member.role == 'moderator'),
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
    if (userResult.rowCount == 0) {
      throw new NotFoundException(
        `User with username/email "${dto.username_or_email}" not found`,
      );
    }

    const targetUser = userResult.rows[0];

    // Check if user is already a member
    const existingMember = membersResult.rows.find(
      (member) => member.user_id == targetUser.user_id,
    );

    if (existingMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.repository.checkExistingInvitation(
      dto.group_id,
      targetUser.user_id
    );

    if (existingInvitation.rowCount > 0) {
      throw new BadRequestException('User already has a pending invitation to this group');
    }

    // Create invitation instead of adding directly
    const invitationResult = await this.repository.createGroupInvitation({
      group_id: dto.group_id,
      inviter_id: adminUserId,
      invited_user_id: targetUser.user_id,
    });

    const invitation = new GroupInvitation(invitationResult.rows[0]);

    // Get group and inviter details for notification
    const group = groupResult.rows[0];
    const inviter = await this.userService.findById(adminUserId);

    // Send notification to invited user
    await this.eventBus.publish(
      new GroupInvitationEvent(
        targetUser.user_id,
        dto.group_id,
        group.name,
        adminUserId,
        inviter.full_name || inviter.username || 'A user',
        invitation.invitation_id,
      )
    );

    return {
      success: true,
      message: `Successfully sent invitation to ${targetUser.username}`,
      invitation: invitation,
      invited_user: {
        user_id: targetUser.user_id,
        username: targetUser.username,
        email: targetUser.email,
      },
    };
  }
}
