import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePlanDTO } from '../dto/create-plan.dto';
import { UpdatePlanDTO } from '../dto/update-plan.dto';
import { GetPlansDTO } from '../dto/get-plans.dto';
import { GetPlanDetailsDTO } from '../dto/get-plan-details.dto';
import { DeletePlanDTO } from '../dto/delete-plan.dto';
import { AddPlanToGroupDTO } from '../dto/add-plan-to-group.dto';
import { CheckGroupPlanDTO } from '../dto/check-group-plan.dto';
import { GetDayPlacesDTO } from '../dto/get-day-places.dto';
import { CreatePlanCommand } from '../commands/create-plan.command';
import { UpdatePlanCommand } from '../commands/update-plan.command';
import { DeletePlanCommand } from '../commands/delete-plan.command';
import { AddPlanToGroupCommand } from '../commands/add-plan-to-group.command';
import { GetPlansQuery } from '../queries/get-plans.query';
import { GetPlanDetailsQuery } from '../queries/get-plan-details.query';
import { CheckGroupPlanQuery } from '../queries/check-group-plan.query';
import { GetDayPlacesQuery } from '../queries/get-day-places.query';

@Injectable()
export class PlanService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  // Get plans with filtering, pagination, and sorting
  async getPlans(dto: GetPlansDTO, userId: number) {
    return this.queryBus.execute(new GetPlansQuery(dto, userId));
  }

  // Get plan details
  async getPlanDetails(dto: GetPlanDetailsDTO, userId: number) {
    return this.queryBus.execute(new GetPlanDetailsQuery(dto, userId));
  }

  // Create a new plan
  async createPlan(dto: CreatePlanDTO, userId: number) {
    return this.commandBus.execute(new CreatePlanCommand(dto, userId));
  }

  // Update a plan
  async updatePlan(dto: UpdatePlanDTO, userId: number) {
    return this.commandBus.execute(new UpdatePlanCommand(dto, userId));
  }

  // Delete a plan
  async deletePlan(dto: DeletePlanDTO, userId: number) {
    return this.commandBus.execute(new DeletePlanCommand(dto, userId));
  }

  // Add plan to group
  async addPlanToGroup(dto: AddPlanToGroupDTO, userId: number) {
    return this.commandBus.execute(new AddPlanToGroupCommand(dto, userId));
  }

  // Check if group has a plan
  async checkGroupPlan(dto: CheckGroupPlanDTO, userId: number) {
    return this.queryBus.execute(new CheckGroupPlanQuery(dto, userId));
  }

  // Get day places
  async getDayPlaces(dto: GetDayPlacesDTO, userId: number) {
    return this.queryBus.execute(new GetDayPlacesQuery(dto, userId));
  }
}
