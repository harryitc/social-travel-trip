import { CreatePlanCommandHandler } from './create-plan.command';
import { UpdatePlanCommandHandler } from './update-plan.command';
import { DeletePlanCommandHandler } from './delete-plan.command';
import { AddPlanToGroupCommandHandler } from './add-plan-to-group.command';
import { CreateScheduleCommandHandler } from './create-schedule.command';

export const CommandHandlers = [
  CreatePlanCommandHandler,
  UpdatePlanCommandHandler,
  DeletePlanCommandHandler,
  AddPlanToGroupCommandHandler,
  CreateScheduleCommandHandler,
];
