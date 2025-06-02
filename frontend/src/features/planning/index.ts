// Export all planning components
export { default as PlanningPage } from './PlanningPage';
export { default as TemplatesList } from './TemplatesList';
export { default as TemplateDetails } from './TemplateDetails';
export { default as ApplyTemplateModal } from './ApplyTemplateModal';
export { default as PlanDetailsOld } from './PlanDetails';

// Export new planning components
export { PlansList } from './PlansList';
export { PlanDetailsView } from './PlanDetailsView';
export { PlanCreator } from './PlanCreator';
export { PlanningDashboard } from './PlanningDashboard';
export { ApplyPlanToGroup } from './ApplyPlanToGroup';
export { SharePlan } from './SharePlan';
export { PlanTimeline } from './PlanTimeline';
export { PlanStats } from './PlanStats';
export { TravelTemplates } from './travel-templates';

// Export services
export { planService } from './services/plan.service';
export type {
  CreatePlanRequest,
  CreateDayPlaceRequest,
  CreateScheduleRequest,
  GetPlansRequest,
  AddPlanToGroupRequest,
  Plan,
  DayPlace,
  Schedule,
  PlanDetails
} from './services/plan.service';

// Export models
export {
  PlanModel,
  DayPlaceModel,
  ScheduleModel,
  PlanDetailsModel
} from './models/plan.model';

// Export config
export { PLAN_APIS, PLAN_STATUS, PLAN_CONFIG, DEFAULT_PLAN_QUERY } from './config/plan.config';

// Export data types and mock data
export * from './mock-data';
export * from './trip-groups-data';
