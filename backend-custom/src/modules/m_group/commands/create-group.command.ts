import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../models/group.model';
import * as crypto from 'crypto';

export class CreateGroupCommand implements ICommand {
  constructor(
    public readonly dto: CreateGroupDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateGroupCommand)
export class CreateGroupCommandHandler
  implements ICommandHandler<CreateGroupCommand>
{
  private readonly logger = new Logger(CreateGroupCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: CreateGroupCommand): Promise<any> {
    const { dto, userId } = command;

    // Generate a permanent join code for the group
    const joinCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    // Create the group with join code
    const insertResult = await this.repository.createGroupWithJoinCode(dto, joinCode);
    const groupData = insertResult.rows[0];
    const groupCreated = new Group(groupData);

    // Add the creator as a member with admin role
    if (groupCreated && groupCreated.group_id) {
      await this.repository.addGroupMember({
        group_id: groupCreated.group_id,
        user_id: userId,
        role: 'admin',
        nickname: null, // Default nickname
      });
    }

    return groupCreated;
  }
}
