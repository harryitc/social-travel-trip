import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../models/group.model';

export class UpdateGroupCommand implements ICommand {
  constructor(
    public readonly dto: UpdateGroupDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateGroupCommand)
export class UpdateGroupCommandHandler
  implements ICommandHandler<UpdateGroupCommand>
{
  private readonly logger = new Logger(UpdateGroupCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: UpdateGroupCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      member => member.user_id == userId && member.role == 'admin'
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can update group information');
    }

    // Update group
    const result = await this.repository.updateGroup(dto.group_id, {
      name: dto.name,
      description: dto.description,
      cover_url: dto.cover_url,
      plan_id: dto.plan_id,
    });

    return new Group(result.rows[0]);
  }
}
