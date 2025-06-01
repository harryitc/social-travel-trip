import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { RespondInvitationDto } from '../dto/respond-invitation.dto';
import { GroupInvitation } from '../models/group-invitation.model';

export class RespondInvitationCommand implements ICommand {
  constructor(
    public readonly dto: RespondInvitationDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(RespondInvitationCommand)
export class RespondInvitationCommandHandler
  implements ICommandHandler<RespondInvitationCommand>
{
  private readonly logger = new Logger(RespondInvitationCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: RespondInvitationCommand): Promise<any> {
    const { dto, userId } = command;

    // Get invitation details
    const invitationResult = await this.repository.getGroupInvitation(
      dto.invitation_id,
    );
    if (invitationResult.rowCount === 0) {
      throw new NotFoundException('Invitation not found');
    }

    const invitation = new GroupInvitation(invitationResult.rows[0]);

    // Check if the user is the invited user
    if (invitation.invited_user_id !== userId) {
      throw new BadRequestException(
        'You are not authorized to respond to this invitation',
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        `Invitation has already been ${invitation.status}`,
      );
    }

    // Check if invitation has expired
    if (invitation.expires_at < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    // Update invitation status
    const updateResult = await this.repository.updateInvitationStatus(
      dto.invitation_id,
      dto.response,
    );

    if (updateResult.rowCount === 0) {
      throw new BadRequestException('Failed to update invitation status');
    }

    // If accepted, add user to group
    if (dto.response === 'accepted') {
      try {
        await this.repository.addGroupMember({
          group_id: invitation.group_id,
          user_id: userId,
          role: 'member',
          nickname: undefined, // Will use username as default
        });

        this.logger.log(
          `User ${userId} accepted invitation and joined group ${invitation.group_id}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to add user to group after accepting invitation: ${error.message}`,
        );
        // Note: Cannot revert to pending status due to type constraints
        // The invitation will remain in accepted state but user won't be in group
        this.logger.error(`User ${userId} accepted invitation but failed to join group ${invitation.group_id}`);
        throw new BadRequestException(
          'Failed to join group. Please try again.',
        );
      }
    }

    return {
      success: true,
      message:
        dto.response === 'accepted'
          ? `Successfully joined group "${invitation.group_name}"`
          : `Invitation to "${invitation.group_name}" declined`,
      invitation: new GroupInvitation(updateResult.rows[0]),
    };
  }
}
