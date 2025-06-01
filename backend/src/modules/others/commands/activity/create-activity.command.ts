import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '../../repositories/activity.repository';
import { CreateActivityDto } from '../../dto/activity.dto';
import { Activity } from '../../models/others.model';

export class CreateActivityCommand implements ICommand {
  constructor(
    public readonly dto: CreateActivityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateActivityCommand)
export class CreateActivityCommandHandler
  implements ICommandHandler<CreateActivityCommand>
{
  private readonly logger = new Logger(CreateActivityCommand.name);

  constructor(private readonly repository: ActivityRepository) {}

  async execute(command: CreateActivityCommand): Promise<any> {
    const { dto } = command;

    // Create activity
    const result = await this.repository.create(dto);
    return new Activity(result.rows[0]);
  }
}
