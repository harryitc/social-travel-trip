import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '../../repositories/activity.repository';
import { UpdateActivityDto } from '../../dto/activity.dto';
import { Activity } from '../../models/others.model';

export class UpdateActivityCommand implements ICommand {
  constructor(
    public readonly dto: UpdateActivityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateActivityCommand)
export class UpdateActivityCommandHandler
  implements ICommandHandler<UpdateActivityCommand>
{
  private readonly logger = new Logger(UpdateActivityCommand.name);

  constructor(private readonly repository: ActivityRepository) {}

  async execute(command: UpdateActivityCommand): Promise<any> {
    const { dto } = command;

    // Check if activity exists
    const existingActivity = await this.repository.findById(dto.activity_id);
    if (existingActivity.rowCount == 0) {
      throw new NotFoundException(`Activity with ID ${dto.activity_id} not found`);
    }

    // Update activity
    const result = await this.repository.update(dto);
    return new Activity(result.rows[0]);
  }
}
