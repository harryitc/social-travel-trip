import {
  Plan,
  PlanDayPlace,
  PlanSchedule,
  PlanWithGroup,
} from '../models/plan.model';

/**
 * Utility class for mapping database results to model objects
 */
export class ModelMapper {
  /**
   * Map database row to Plan model
   * @param data Database row
   * @returns Plan model
   */
  static toPlan(data: any): Plan {
    if (!data) return null;
    return new Plan(data);
  }

  /**
   * Map database row to PlanDayPlace model
   * @param data Database row
   * @returns PlanDayPlace model
   */
  static toPlanDayPlace(data: any): PlanDayPlace {
    if (!data) return null;
    return new PlanDayPlace(data);
  }

  /**
   * Map database row to PlanSchedule model
   * @param data Database row
   * @returns PlanSchedule model
   */
  static toPlanSchedule(data: any): PlanSchedule {
    if (!data) return null;
    return new PlanSchedule(data);
  }

  /**
   * Map database row to PlanWithGroup model
   * @param data Database row
   * @returns PlanWithGroup model
   */
  static toPlanWithGroup(data: any): PlanWithGroup {
    if (!data) return null;
    return new PlanWithGroup(data);
  }

  /**
   * Map array of database rows to array of Plan models
   * @param dataArray Array of database rows
   * @returns Array of Plan models
   */
  static toPlans(dataArray: any[]): Plan[] {
    if (!dataArray || !Array.isArray(dataArray)) return [];
    return dataArray.map((data) => this.toPlan(data));
  }

  /**
   * Map array of database rows to array of PlanDayPlace models
   * @param dataArray Array of database rows
   * @returns Array of PlanDayPlace models
   */
  static toPlanDayPlaces(dataArray: any[]): PlanDayPlace[] {
    if (!dataArray || !Array.isArray(dataArray)) return [];
    return dataArray.map((data) => this.toPlanDayPlace(data));
  }

  /**
   * Map array of database rows to array of PlanSchedule models
   * @param dataArray Array of database rows
   * @returns Array of PlanSchedule models
   */
  static toPlanSchedules(dataArray: any[]): PlanSchedule[] {
    if (!dataArray || !Array.isArray(dataArray)) return [];
    return dataArray.map((data) => this.toPlanSchedule(data));
  }
}
