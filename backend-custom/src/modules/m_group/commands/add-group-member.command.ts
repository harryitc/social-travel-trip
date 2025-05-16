import { ICommand } from '@nestjs/cqrs';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';

export class AddGroupMemberCommand implements ICommand {
  constructor(
    public readonly dto: AddGroupMemberDto,
    public readonly adminUserId: number,
  ) {}
}

export class AddGroupMemberHandler {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(command: AddGroupMemberCommand) {
    const { dto, adminUserId } = command;
    
    // Verify admin permission
    const adminMember = await this.groupMemberRepository.findOne({
      where: {
        group_id: dto.group_id,
        user_id: adminUserId,
        role: 'admin',
      },
    });

    if (!adminMember) {
      throw new Error('Only admin can add members');
    }

    // Add new member
    return this.groupMemberRepository.create({
      ...dto,
      join_at: new Date(),
    });
  }
}
