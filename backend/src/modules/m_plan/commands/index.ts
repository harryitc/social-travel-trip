import { CreatePlanCommandHandler } from './create-plan.command';
import { UpdatePlanCommandHandler } from './update-plan.command';
import { DeletePlanCommandHandler } from './delete-plan.command';
import { AddPlanToGroupCommandHandler } from './add-plan-to-group.command';
import { CreateScheduleCommandHandler } from './create-schedule.command';
import { CreateDayPlaceCommandHandler } from './create-day-place.command';
import { UpdatePlanBasicCommandHandler } from './update-plan-basic.command';
import { UpdatePlanPlacesCommandHandler } from './update-plan-places.command';
import { UpdatePlanSchedulesCommandHandler } from './update-plan-schedules.command';

export const CommandHandlers = [
  CreatePlanCommandHandler,
  UpdatePlanCommandHandler,
  DeletePlanCommandHandler,
  AddPlanToGroupCommandHandler,
  CreateScheduleCommandHandler,
  CreateDayPlaceCommandHandler,
  UpdatePlanBasicCommandHandler,
  UpdatePlanPlacesCommandHandler,
  UpdatePlanSchedulesCommandHandler,
];
