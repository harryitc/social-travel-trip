import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { CreateScheduleDTO } from '../dto/create-schedule.dto';
import { ModelMapper } from '../utils/model-mapper.util';

export class CreateScheduleCommand implements ICommand {
  constructor(
    public readonly data: CreateScheduleDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleCommandHandler
  implements ICommandHandler<CreateScheduleCommand>
{
  private readonly logger = new Logger(CreateScheduleCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: CreateScheduleCommand): Promise<any> {
    const { data, userId } = command;

    // Check if day place exists
    const dayPlaceResult = await this.repository.getDayPlaceById(
      data.plan_day_place_id,
    );

    if (dayPlaceResult.rowCount == 0) {
      throw new NotFoundException(
        `Day place with ID ${data.plan_day_place_id} not found`,
      );
    }

    const dayPlace = dayPlaceResult.rows[0];

    // Check if plan exists and user has permission
    const planResult = await this.repository.getPlanById(dayPlace.plan_id);

    if (planResult.rowCount == 0) {
      throw new NotFoundException(`Plan not found`);
    }

    const plan = planResult.rows[0];

    // Only the creator can add schedules to the plan
    if (plan.user_created != userId) {
      throw new UnauthorizedException(
        'You do not have permission to add schedules to this plan',
      );
    }

    // Create schedule
    const result = await this.repository.createSchedule(data);

    return ModelMapper.toPlanSchedule(result.rows[0]);
  }
}
