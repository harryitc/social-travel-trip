import { Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { KickGroupMemberDto } from '../dto/kick-group-member.dto';

export class KickGroupMemberCommand implements ICommand {
  constructor(
    public readonly dto: KickGroupMemberDto,
    public readonly adminUserId: number,
  ) {}
}

@CommandHandler(KickGroupMemberCommand)
export class KickGroupMemberCommandHandler
  implements ICommandHandler<KickGroupMemberCommand>
{
  private readonly logger = new Logger(KickGroupMemberCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: KickGroupMemberCommand): Promise<any> {
    const { dto, adminUserId } = command;

    // Verify admin permission
    const adminMembersResult = await this.repository.getGroupMembers(
      dto.group_id,
    );

    const adminMember = adminMembersResult.rows.find(
      (member) => member.user_id === adminUserId && 
                 (member.role === 'admin' || member.role === 'moderator'),
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin or moderator can kick members');
    }

    // Check if target user is an admin (admins can't be kicked)
    const targetMember = adminMembersResult.rows.find(
      (member) => member.user_id === dto.user_id,
    );

    if (!targetMember) {
      throw new NotFoundException('Member not found in this group');
    }

    if (targetMember.role === 'admin') {
      throw new UnauthorizedException('Cannot kick an admin from the group');
    }

    // If moderator tries to kick another moderator
    if (adminMember.role === 'moderator' && targetMember.role === 'moderator') {
      throw new UnauthorizedException('Moderators cannot kick other moderators');
    }

    // Kick the member
    const result = await this.repository.kickGroupMember(
      dto.group_id,
      dto.user_id,
    );

    return {
      success: result.rowCount > 0,
      message: 'Member has been removed from the group',
      data: result.rows[0],
    };
  }
}
