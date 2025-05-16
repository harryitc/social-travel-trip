import { ICommand } from '@nestjs/cqrs';
import { CreateGroupDto } from '../dto/create-group.dto';

export class CreateGroupCommand implements ICommand {
  constructor(
    public readonly dto: CreateGroupDto,
    public readonly userId: number,
  ) {}
}

export class CreateGroupHandler {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(command: CreateGroupCommand) {
    const { dto, userId } = command;
    
    const group = await this.groupRepository.create({
      ...dto,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Add creator as admin
    await this.groupMemberRepository.create({
      group_id: group.group_id,
      user_id: userId,
      role: 'admin',
      join_at: new Date(),
    });

    return group;
  }
}
