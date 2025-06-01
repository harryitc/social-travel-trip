import Http from '@/lib/http';
import { PLAN_APIS } from '../config/plan.config';
import { PlanModel, DayPlaceModel, ScheduleModel, PlanDetailsModel } from '../models/plan.model';

// Types based on backend DTOs
export interface CreatePlanRequest {
  name: string;
  description?: string;
  days: number;
  location: {
    name: string;
    description?: string;
    lat: number;
    lon: number;
  };
  thumbnail_url?: string;
  status?: 'public' | 'private';
  json_data?: {
    name_khong_dau?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface CreateDayPlaceRequest {
  plan_id: number;
  ngay: string; // Day number as string
  location: {
    name: string;
    description?: string;
    lat: number;
    lon: number;
  };
  json_data?: any;
}

export interface CreateScheduleRequest {
  name: string;
  description?: string;
  start_time?: Date;
  end_time?: Date;
  location: {
    name: string;
    description?: string;
    lat: number;
    lon: number;
  };
  json_data?: any;
  activity_id?: number;
  plan_day_place_id: number;
}

export interface GetPlansRequest {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  tags?: string[];
}

// Type aliases for backward compatibility
export type Plan = PlanModel;
export type DayPlace = DayPlaceModel;
export type Schedule = ScheduleModel;
export type PlanDetails = PlanDetailsModel;

export interface AddPlanToGroupRequest {
  plan_id: number;
  group_id: number;
}

/**
 * Service for handling travel plans
 */
export const planService = {
  /**
   * Get all plans with filtering
   * @param params Query parameters
   * @returns Promise with plans list
   */
  async getPlans(params: GetPlansRequest = {}) {
    try {
      const response: any = await Http.post(PLAN_APIS.QUERY, params);
      return {
        ...response,
        data: response.data ? PlanModel.fromResponseArray(response.data) : []
      };
    } catch (error) {
      console.error('Error getting plans:', error);
      throw error;
    }
  },

  /**
   * Get plan details with day places and schedules
   * @param planId Plan ID
   * @returns Promise with plan details
   */
  async getPlanDetails(planId: number): Promise<PlanDetailsModel> {
    try {
      const response: any = await Http.post(PLAN_APIS.DETAILS, {
        plan_id: planId
      });
      return new PlanDetailsModel(response);
    } catch (error) {
      console.error('Error getting plan details:', error);
      throw error;
    }
  },

  /**
   * Create a new plan
   * @param data Plan creation data
   * @returns Promise with created plan
   */
  async createPlan(data: CreatePlanRequest): Promise<PlanModel> {
    try {
      const response: any = await Http.post(PLAN_APIS.CREATE, data);
      return new PlanModel(response);
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },

  /**
   * Update plan basic info
   * @param planId Plan ID
   * @param data Update data
   * @returns Promise with updated plan
   */
  async updatePlanBasic(planId: number, data: Partial<CreatePlanRequest>) {
    try {
      const response: any = await Http.post(PLAN_APIS.UPDATE_BASIC, {
        plan_id: planId,
        ...data
      });
      return response;
    } catch (error) {
      console.error('Error updating plan basic info:', error);
      throw error;
    }
  },

  /**
   * Create day place
   * @param data Day place creation data
   * @returns Promise with created day place
   */
  async createDayPlace(data: CreateDayPlaceRequest): Promise<DayPlaceModel> {
    try {
      const response: any = await Http.post(PLAN_APIS.CREATE_DAY_PLACE, data);
      return new DayPlaceModel(response);
    } catch (error) {
      console.error('Error creating day place:', error);
      throw error;
    }
  },

  /**
   * Get day places for a plan
   * @param planId Plan ID
   * @returns Promise with day places
   */
  async getDayPlaces(planId: number) {
    try {
      const response: any = await Http.post(PLAN_APIS.GET_DAY_PLACES, {
        plan_id: planId
      });
      return {
        ...response,
        data: response.data ? DayPlaceModel.fromResponseArray(response.data) : []
      };
    } catch (error) {
      console.error('Error getting day places:', error);
      throw error;
    }
  },

  /**
   * Create schedule
   * @param data Schedule creation data
   * @returns Promise with created schedule
   */
  async createSchedule(data: CreateScheduleRequest): Promise<ScheduleModel> {
    try {
      const response: any = await Http.post(PLAN_APIS.CREATE_SCHEDULE, data);
      return new ScheduleModel(response);
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  /**
   * Get schedules for a day place
   * @param dayPlaceId Day place ID
   * @returns Promise with schedules
   */
  async getSchedules(dayPlaceId: number) {
    try {
      const response: any = await Http.post(PLAN_APIS.GET_SCHEDULES, {
        plan_day_place_id: dayPlaceId
      });
      return {
        ...response,
        data: response.data ? ScheduleModel.fromResponseArray(response.data) : []
      };
    } catch (error) {
      console.error('Error getting schedules:', error);
      throw error;
    }
  },

  /**
   * Add plan to group
   * @param data Plan to group data
   * @returns Promise with result
   */
  async addPlanToGroup(data: AddPlanToGroupRequest) {
    try {
      const response: any = await Http.post(PLAN_APIS.ADD_TO_GROUP, data);
      return response;
    } catch (error) {
      console.error('Error adding plan to group:', error);
      throw error;
    }
  },

  /**
   * Check if group has a plan
   * @param groupId Group ID
   * @returns Promise with check result
   */
  async checkGroupPlan(groupId: number) {
    try {
      const response: any = await Http.post(PLAN_APIS.CHECK_GROUP_PLAN, {
        group_id: groupId
      });
      return response;
    } catch (error) {
      console.error('Error checking group plan:', error);
      throw error;
    }
  },

  /**
   * Delete plan
   * @param planId Plan ID
   * @returns Promise with result
   */
  async deletePlan(planId: number) {
    try {
      const response: any = await Http.post(PLAN_APIS.DELETE, {
        plan_id: planId
      });
      return response;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  },

  /**
   * Update plan places
   * @param planId Plan ID
   * @param dayPlaces Day places data
   * @returns Promise with result
   */
  async updatePlanPlaces(planId: number, dayPlaces: any[]) {
    try {
      const response: any = await Http.post(PLAN_APIS.UPDATE_PLACES, {
        plan_id: planId,
        day_places: dayPlaces
      });
      return response;
    } catch (error) {
      console.error('Error updating plan places:', error);
      throw error;
    }
  },

  /**
   * Update plan schedules
   * @param planId Plan ID
   * @param schedules Schedules data
   * @returns Promise with result
   */
  async updatePlanSchedules(planId: number, schedules: any[]) {
    try {
      const response: any = await Http.post(PLAN_APIS.UPDATE_SCHEDULES, {
        plan_id: planId,
        schedules: schedules
      });
      return response;
    } catch (error) {
      console.error('Error updating plan schedules:', error);
      throw error;
    }
  }
};
