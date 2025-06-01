import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
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
  constructor(private readonly repository: GroupRepository) {}

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

    // Note: This is direct member addition, not invitation system
    // No notification needed as user is added directly by admin

    return new GroupMember(result.rows[0]);
  }
}
