import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../models/group.model';
import { BadRequestException } from '@common/exceptions';
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

    // Validate and set default status
    const status = dto.status || 'private';

    // Validate json_data structure if location is provided
    if (dto.json_data?.location && typeof dto.json_data.location !== 'string') {
      throw new BadRequestException('Location in json_data must be a string');
    }

    // Validate group name
    if (!dto.name || dto.name.trim().length < 3) {
      throw new BadRequestException(
        'Group name must be at least 3 characters long',
      );
    }

    // Always generate a join code for groups (both public and private can have join codes)
    const joinCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    // Create the group with join code
    const groupDto = {
      ...dto,
      status,
      json_data: dto.json_data || {},
    };

    const insertResult = await this.repository.createGroupWithJoinCode(
      groupDto,
      joinCode,
    );
    const groupData = insertResult.rows[0];
    const groupCreated = new Group(groupData);

    // Add the creator as a member with admin role
    if (groupCreated && groupCreated.group_id) {
      await this.repository.addGroupMember({
        group_id: groupCreated.group_id,
        user_id: userId,
        role: 'admin',
        nickname: undefined, // Let the repository set default nickname to username
      });
    }

    this.logger.log(
      `Group created successfully: ${groupCreated.name} (ID: ${groupCreated.group_id}) with join code: ${joinCode}`,
    );

    return groupCreated;
  }
}
