import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { UpdatePlanDTO } from '../dto/update-plan.dto';
import { Plan } from '../models/plan.model';

export class UpdatePlanCommand implements ICommand {
  constructor(
    public readonly data: UpdatePlanDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanCommandHandler
  implements ICommandHandler<UpdatePlanCommand>
{
  private readonly logger = new Logger(UpdatePlanCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: UpdatePlanCommand): Promise<any> {
    const { data, userId } = command;

    // Check if plan exists and user has permission to update it
    const planResult = await this.repository.getPlanById(data.plan_id);

    if (planResult.rowCount === 0) {
      throw new NotFoundException(`Plan with ID ${data.plan_id} not found`);
    }

    const plan = planResult.rows[0];

    // Only the creator can update the plan
    if (plan.user_created !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to update this plan',
      );
    }

    // Update plan with transaction to handle day places and schedules
    const result = await this.repository.updatePlanWithTransaction(data);

    return new Plan(result);
  }
}
