import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';

/**
 * Interface for trip query parameters
 */
export interface TripQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  group_id?: string;
}

/**
 * Interface for trip model
 */
export interface Trip {
  plan_id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  duration: number;
  image?: string;
  created_at: string;
  updated_at: string;
  author: {
    user_id: string;
    username: string;
    full_name: string;
    avatar?: string;
  };
  group_id?: string;
  members?: {
    user_id: string;
    username: string;
    full_name: string;
    avatar?: string;
    role?: string;
  }[];
  is_public: boolean;
}

/**
 * Interface for trip details
 */
export interface TripDetails extends Trip {
  places: {
    place_id: string;
    name: string;
    description?: string;
    location?: string;
    image?: string;
    day: number;
    schedules?: {
      schedule_id: string;
      title: string;
      description?: string;
      start_time: string;
      end_time: string;
    }[];
  }[];
}

/**
 * Service for handling trips
 */
export const tripService = {
  /**
   * Get trips with optional filtering
   * @param params Query parameters
   * @returns Promise with trips
   */
  async getTrips(params: TripQueryParams = {}): Promise<{ data: Trip[], total: number, page: number, limit: number }> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/plan/query`, { params });
      return response.data;
    } catch (error) {
      console.error('Error getting trips:', error);
      throw error;
    }
  },

  /**
   * Get trip details
   * @param tripId Trip ID
   * @returns Promise with trip details
   */
  async getTripDetails(tripId: string): Promise<TripDetails> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/plan/details`, { 
        params: { plan_id: tripId } 
      });
      return response.data;
    } catch (error) {
      console.error('Error getting trip details:', error);
      throw error;
    }
  },

  /**
   * Get upcoming trips
   * @param limit Number of trips to return
   * @returns Promise with upcoming trips
   */
  async getUpcomingTrips(limit: number = 5): Promise<Trip[]> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/plan/query`, { 
        params: { 
          limit,
          sort_by: 'upcoming',
          page: 1
        } 
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting upcoming trips:', error);
      throw error;
    }
  },

  /**
   * Get user trips
   * @param userId User ID
   * @param limit Number of trips to return
   * @returns Promise with user trips
   */
  async getUserTrips(userId: string, limit: number = 5): Promise<Trip[]> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/plan/query`, { 
        params: { 
          limit,
          user_id: userId,
          page: 1
        } 
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw error;
    }
  }
};
