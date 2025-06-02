import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { AddPlanToGroupDTO } from '../dto/add-plan-to-group.dto';
import { PlanWithGroup } from '../models/plan.model';

export class AddPlanToGroupCommand implements ICommand {
  constructor(
    public readonly data: AddPlanToGroupDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(AddPlanToGroupCommand)
export class AddPlanToGroupCommandHandler
  implements ICommandHandler<AddPlanToGroupCommand>
{
  private readonly logger = new Logger(AddPlanToGroupCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: AddPlanToGroupCommand): Promise<any> {
    const { data, userId } = command;

    // Check if plan exists
    const planResult = await this.repository.getPlanById(data.plan_id);

    if (planResult.rowCount == 0) {
      throw new NotFoundException(`Plan with ID ${data.plan_id} not found`);
    }

    // Check if group already has a plan
    const groupPlanResult = await this.repository.checkGroupPlan(data.group_id);

    if (groupPlanResult.rowCount > 0) {
      throw new BadRequestException(`Group already has a plan assigned`);
    }

    // Add plan to group
    const result = await this.repository.addPlanToGroup(data, userId);

    if (result.rowCount == 0) {
      // This could happen if there's a conflict (plan already added to group)
      return { success: false, message: 'Plan is already added to this group' };
    }

    return new PlanWithGroup(result.rows[0]);
  }
}
