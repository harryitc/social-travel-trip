import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '../../repositories/activity.repository';
import { CreateIfNotExistsActivityDto } from '../../dto/activity.dto';
import { Activity } from '../../models/others.model';

export class CreateIfNotExistsActivityCommand implements ICommand {
  constructor(
    public readonly dto: CreateIfNotExistsActivityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateIfNotExistsActivityCommand)
export class CreateIfNotExistsActivityCommandHandler
  implements ICommandHandler<CreateIfNotExistsActivityCommand>
{
  private readonly logger = new Logger(CreateIfNotExistsActivityCommand.name);

  constructor(private readonly repository: ActivityRepository) {}

  async execute(command: CreateIfNotExistsActivityCommand): Promise<any> {
    const { dto } = command;

    // Create activity if not exists
    const result = await this.repository.createIfNotExists(dto.name);
    return new Activity(result.rows[0]);
  }
}
