import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { CreateDayPlaceDTO } from '../dto/create-day-place.dto';
import { PlanDayPlace } from '../models/plan.model';

export class CreateDayPlaceCommand implements ICommand {
  constructor(
    public readonly data: CreateDayPlaceDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateDayPlaceCommand)
export class CreateDayPlaceCommandHandler
  implements ICommandHandler<CreateDayPlaceCommand>
{
  private readonly logger = new Logger(CreateDayPlaceCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: CreateDayPlaceCommand): Promise<any> {
    const { data, userId } = command;

    // Check if plan exists and user has permission
    const planResult = await this.repository.getPlanById(data.plan_id);

    if (planResult.rowCount === 0) {
      throw new NotFoundException(`Plan with ID ${data.plan_id} not found`);
    }

    const plan = planResult.rows[0];

    // Only the creator can add day places to the plan
    if (plan.user_created !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to add day places to this plan',
      );
    }

    // Create day place
    const result = await this.repository.createDayPlace(data);

    return new PlanDayPlace(result.rows[0]);
  }
}
