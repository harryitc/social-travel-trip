import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { CreatePlanDTO } from '../dto/create-plan.dto';
import { Plan } from '../models/plan.model';
import { ModelMapper } from '../utils/model-mapper.util';

export class CreatePlanCommand implements ICommand {
  constructor(
    public readonly data: CreatePlanDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreatePlanCommand)
export class CreatePlanCommandHandler
  implements ICommandHandler<CreatePlanCommand>
{
  private readonly logger = new Logger(CreatePlanCommand.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(command: CreatePlanCommand): Promise<any> {
    const { data, userId } = command;

    // Create plan with transaction to handle day places
    const result = await this.repository.createPlanWithTransaction(
      data,
      userId,
    );

    return ModelMapper.toPlan(result);
  }
}
