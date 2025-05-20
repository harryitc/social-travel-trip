import { GetPlansQueryHandler } from './get-plans.query';
import { GetPlanDetailsQueryHandler } from './get-plan-details.query';
import { CheckGroupPlanQueryHandler } from './check-group-plan.query';
import { GetDayPlacesQueryHandler } from './get-day-places.query';
import { GetSchedulesQueryHandler } from './get-schedules.query';

export const QueryHandlers = [
  GetPlansQueryHandler,
  GetPlanDetailsQueryHandler,
  CheckGroupPlanQueryHandler,
  GetDayPlacesQueryHandler,
  GetSchedulesQueryHandler,
];
