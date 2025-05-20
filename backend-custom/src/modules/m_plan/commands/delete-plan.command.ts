import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { DeletePlanDTO } from '../dto/delete-plan.dto';

export class DeletePlanCommand implements ICommand {
  constructor(
    public readonly data: DeletePlanDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeletePlanCommand)
export class DeletePlanCommandHandler
  implements ICommandHandler<DeletePlanCommand>
{
  private readonly logger = new Logger(DeletePlanCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: DeletePlanCommand): Promise<any> {
    const { data, userId } = command;

    // Check if plan exists and user has permission to delete it
    const planResult = await this.repository.getPlanById(data.plan_id);

    if (planResult.rowCount == 0) {
      throw new NotFoundException(`Plan with ID ${data.plan_id} not found`);
    }

    const plan = planResult.rows[0];

    // Only the creator can delete the plan
    if (plan.user_created != userId) {
      throw new UnauthorizedException(
        'You do not have permission to delete this plan',
      );
    }

    // Delete plan with transaction to handle related records
    const result = await this.repository.deletePlan(data.plan_id);

    return {
      success: true,
      message: 'Plan deleted successfully',
      plan: result,
    };
  }
}
