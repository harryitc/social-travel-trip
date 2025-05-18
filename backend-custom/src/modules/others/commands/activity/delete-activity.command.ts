import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '../../repositories/activity.repository';
import { DeleteActivityDto } from '../../dto/activity.dto';
import { Activity } from '../../models/others.model';

export class DeleteActivityCommand implements ICommand {
  constructor(
    public readonly dto: DeleteActivityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteActivityCommand)
export class DeleteActivityCommandHandler
  implements ICommandHandler<DeleteActivityCommand>
{
  private readonly logger = new Logger(DeleteActivityCommand.name);

  constructor(private readonly repository: ActivityRepository) {}

  async execute(command: DeleteActivityCommand): Promise<any> {
    const { dto } = command;

    // Check if activity exists
    const existingActivity = await this.repository.findById(dto.activity_id);
    if (existingActivity.rowCount === 0) {
      throw new NotFoundException(`Activity with ID ${dto.activity_id} not found`);
    }

    // Delete activity
    const result = await this.repository.delete(dto.activity_id);
    return new Activity(result.rows[0]);
  }
}
