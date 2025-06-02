import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { UpdateMemberNicknameDto } from '../dto/update-member-nickname.dto';
import { GroupMember } from '../models/group.model';
import { NotFoundException, UnauthorizedException } from '@common/exceptions';

export class UpdateMemberNicknameCommand implements ICommand {
  constructor(
    public readonly dto: UpdateMemberNicknameDto,
    public readonly requestUserId: number,
  ) {}
}

@CommandHandler(UpdateMemberNicknameCommand)
export class UpdateMemberNicknameCommandHandler
  implements ICommandHandler<UpdateMemberNicknameCommand>
{
  private readonly logger = new Logger(UpdateMemberNicknameCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: UpdateMemberNicknameCommand): Promise<any> {
    const { dto, requestUserId } = command;

    // Check if the group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Get group members to verify permissions
    const membersResult = await this.repository.getGroupMembers(dto.group_id);

    // Check if request user is a member of the group
    const requestUserMember = membersResult.rows.find(
      (member) => member.user_id == requestUserId,
    );

    if (!requestUserMember) {
      throw new UnauthorizedException('You are not a member of this group');
    }

    // Check if target user is a member of the group
    const targetUserMember = membersResult.rows.find(
      (member) => member.user_id == dto.user_id,
    );

    if (!targetUserMember) {
      throw new NotFoundException('Target user is not a member of this group');
    }

    // Permission check: Users can only update their own nickname,
    // unless they are admin/moderator
    const isAdminOrModerator =
      requestUserMember.role == 'admin' ||
      requestUserMember.role == 'moderator';
    const isUpdatingOwnNickname = requestUserId == dto.user_id;

    if (!isUpdatingOwnNickname && !isAdminOrModerator) {
      throw new UnauthorizedException('You can only update your own nickname');
    }

    // Update nickname
    const result = await this.repository.updateGroupMemberNickname(
      dto.group_id,
      dto.user_id,
      dto.nickname,
    );

    if (result.rowCount == 0) {
      throw new NotFoundException('Failed to update nickname');
    }

    return new GroupMember(result.rows[0]);
  }
}
