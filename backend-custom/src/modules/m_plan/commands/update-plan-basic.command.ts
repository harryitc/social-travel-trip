import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { UpdatePlanBasicDTO } from '../dto/update-plan-basic.dto';
import { Plan } from '../models/plan.model';

export class UpdatePlanBasicCommand implements ICommand {
  constructor(
    public readonly data: UpdatePlanBasicDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdatePlanBasicCommand)
export class UpdatePlanBasicCommandHandler
  implements ICommandHandler<UpdatePlanBasicCommand>
{
  private readonly logger = new Logger(UpdatePlanBasicCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: UpdatePlanBasicCommand): Promise<any> {
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

    // Update plan basic info
    const result = await this.repository.updatePlanBasic(data);

    return new Plan(result.rows[0]);
  }
}
