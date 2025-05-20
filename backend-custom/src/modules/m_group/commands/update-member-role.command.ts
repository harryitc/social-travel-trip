import {
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { GroupMember } from '../models/group.model';

export class UpdateMemberRoleCommand implements ICommand {
  constructor(
    public readonly dto: UpdateMemberRoleDto,
    public readonly adminUserId: number,
  ) {}
}

@CommandHandler(UpdateMemberRoleCommand)
export class UpdateMemberRoleCommandHandler
  implements ICommandHandler<UpdateMemberRoleCommand>
{
  private readonly logger = new Logger(UpdateMemberRoleCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: UpdateMemberRoleCommand): Promise<any> {
    const { dto, adminUserId } = command;

    // Check if the group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);

    const adminMember = membersResult.rows.find(
      (member) => member.user_id == adminUserId && member.role == 'admin',
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can update member roles');
    }

    // Check if trying to update own role
    if (dto.user_id == adminUserId) {
      throw new BadRequestException('You cannot update your own role');
    }

    // Check if target user exists in the group
    const targetMember = membersResult.rows.find(
      (member) => member.user_id == dto.user_id,
    );

    if (!targetMember) {
      throw new NotFoundException('Member not found in this group');
    }

    // If trying to set another member as admin, check if there's already an admin
    if (dto.role == 'admin') {
      // Check if we're trying to create a second admin
      const existingAdmins = membersResult.rows.filter(
        (member) => member.role == 'admin' && member.user_id != dto.user_id,
      );

      if (existingAdmins.length > 0) {
        throw new BadRequestException(
          'Group already has an admin. Only one admin is allowed per group.',
        );
      }
    }

    // Update the member's role
    const result = await this.repository.updateGroupMemberRole(
      dto.group_id,
      dto.user_id,
      dto.role,
    );

    return new GroupMember(result.rows[0]);
  }
}
