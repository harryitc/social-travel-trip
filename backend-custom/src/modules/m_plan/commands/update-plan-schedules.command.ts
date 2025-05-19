import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { UpdatePlanSchedulesDTO } from '../dto/update-plan-schedules.dto';
import { PlanSchedule } from '../models/plan.model';

export class UpdatePlanSchedulesCommand implements ICommand {
  constructor(
    public readonly data: UpdatePlanSchedulesDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdatePlanSchedulesCommand)
export class UpdatePlanSchedulesCommandHandler
  implements ICommandHandler<UpdatePlanSchedulesCommand>
{
  private readonly logger = new Logger(UpdatePlanSchedulesCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: UpdatePlanSchedulesCommand): Promise<any> {
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

    // Update plan schedules with transaction
    const updatedSchedules = await this.repository.updatePlanSchedules(data);

    return {
      plan_id: data.plan_id,
      schedules: updatedSchedules.map((schedule) => new PlanSchedule(schedule)),
    };
  }
}
