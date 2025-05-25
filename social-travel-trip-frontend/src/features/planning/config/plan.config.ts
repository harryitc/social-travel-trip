import { API_ENDPOINT } from '@/config/api.config';

/**
 * Plan API endpoints configuration
 */
export const PLAN_APIS = {
  // Plan management
  QUERY: `${API_ENDPOINT.social_travel_trip}/plan/query`,
  DETAILS: `${API_ENDPOINT.social_travel_trip}/plan/details`,
  CREATE: `${API_ENDPOINT.social_travel_trip}/plan/create`,
  UPDATE_BASIC: `${API_ENDPOINT.social_travel_trip}/plan/update-basic`,
  DELETE: `${API_ENDPOINT.social_travel_trip}/plan/delete`,
  
  // Day places management
  CREATE_DAY_PLACE: `${API_ENDPOINT.social_travel_trip}/plan/create-day-place`,
  GET_DAY_PLACES: `${API_ENDPOINT.social_travel_trip}/plan/get-day-places`,
  UPDATE_PLACES: `${API_ENDPOINT.social_travel_trip}/plan/update-places`,
  
  // Schedules management
  CREATE_SCHEDULE: `${API_ENDPOINT.social_travel_trip}/plan/create-schedule`,
  GET_SCHEDULES: `${API_ENDPOINT.social_travel_trip}/plan/get-schedules`,
  UPDATE_SCHEDULES: `${API_ENDPOINT.social_travel_trip}/plan/update-schedules`,
  
  // Group integration
  ADD_TO_GROUP: `${API_ENDPOINT.social_travel_trip}/plan/add-to-group`,
  CHECK_GROUP_PLAN: `${API_ENDPOINT.social_travel_trip}/plan/check-group-plan`,
};

/**
 * Plan status options
 */
export const PLAN_STATUS = {
  PUBLIC: 'public',
  PRIVATE: 'private'
} as const;

/**
 * Default plan configuration
 */
export const PLAN_CONFIG = {
  DEFAULT_DAYS: 3,
  MAX_DAYS: 30,
  MIN_DAYS: 1,
  DEFAULT_STATUS: PLAN_STATUS.PRIVATE,
  MAX_TAGS: 10,
  MAX_SCHEDULES_PER_DAY: 20,
  MAX_PLACES_PER_DAY: 10
} as const;

/**
 * Plan query default parameters
 */
export const DEFAULT_PLAN_QUERY = {
  page: 1,
  limit: 12,
  status: 'all'
} as const;
