import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { UpdatePlanPlacesDTO } from '../dto/update-plan-places.dto';
import { Plan } from '../models/plan.model';

export class UpdatePlanPlacesCommand implements ICommand {
  constructor(
    public readonly data: UpdatePlanPlacesDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdatePlanPlacesCommand)
export class UpdatePlanPlacesCommandHandler
  implements ICommandHandler<UpdatePlanPlacesCommand>
{
  private readonly logger = new Logger(UpdatePlanPlacesCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: UpdatePlanPlacesCommand): Promise<any> {
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

    // Update plan places with transaction
    const result = await this.repository.updatePlanPlaces(data);

    // Get updated plan with day places
    const updatedPlanResult = await this.repository.getPlanById(data.plan_id);
    const dayPlacesResult = await this.repository.getPlanDayPlaces(
      data.plan_id,
    );

    return {
      ...new Plan(updatedPlanResult.rows[0]),
      day_places: dayPlacesResult.rows,
    };
  }
}
