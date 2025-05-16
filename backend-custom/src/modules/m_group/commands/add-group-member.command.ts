import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { GroupMember } from '../models/group.model';

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

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: AddGroupMemberCommand): Promise<any> {
    const { dto, adminUserId } = command;

    // Verify admin permission
    const adminMembersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = adminMembersResult.rows.find(
      member => member.user_id === adminUserId && member.role === 'admin'
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can add members');
    }

    // Add new member
    const result = await this.repository.addGroupMember({
      group_id: dto.group_id,
      user_id: dto.user_id,
      role: dto.role || 'member',
      nickname: dto.nickname,
    });

    return new GroupMember(result.rows[0]);
  }
}
