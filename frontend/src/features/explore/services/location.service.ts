import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import {
  Province,
  City,
  Location,
  Hashtag,
  LocationQueryParams
} from '../models/location.model';

/**
 * Service for handling locations
 */
export const locationService = {
  /**
   * Get provinces
   * @returns Promise with provinces
   */
  async getProvinces(): Promise<Province[]> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/provinces/query`);
      return Province.fromResponseArray(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error getting provinces:', error);
      throw error;
    }
  },

  /**
   * Get cities
   * @param provinceId Optional province ID to filter by
   * @returns Promise with cities
   */
  async getCities(provinceId?: string): Promise<City[]> {
    try {
      const params = provinceId ? { province_id: provinceId } : undefined;
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/cities/query`, { params });
      return City.fromResponseArray(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error getting cities:', error);
      throw error;
    }
  },

  /**
   * Get locations with optional filtering
   * @param params Query parameters
   * @returns Promise with locations
   */
  async getLocations(params: LocationQueryParams = {}): Promise<{ data: Location[], total: number, page: number, limit: number }> {
    try {
      // Use cities endpoint as a proxy for locations
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/cities/query`, { params });
      return {
        data: Location.fromResponseArray(Array.isArray(response.data?.data) ? response.data.data : []),
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || 10
      };
    } catch (error) {
      console.error('Error getting locations:', error);
      throw error;
    }
  },

  /**
   * Get trending locations
   * @param limit Number of locations to return
   * @returns Promise with trending locations
   */
  async getTrendingLocations(limit: number = 5): Promise<Location[]> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/cities/query`, {
        params: {
          limit,
          sort_by: 'trending',
          page: 1
        }
      });
      return Location.fromResponseArray(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error getting trending locations:', error);
      throw error;
    }
  },

  /**
   * Get location details
   * @param locationId Location ID
   * @returns Promise with location details
   */
  async getLocationDetails(locationId: string): Promise<Location> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/cities/get-by-id`, {
        params: { city_id: locationId }
      });
      return Location.fromResponse(response.data);
    } catch (error) {
      console.error('Error getting location details:', error);
      throw error;
    }
  },

  /**
   * Get trending hashtags for a location
   * @param locationId Location ID
   * @param limit Number of hashtags to return
   * @returns Promise with trending hashtags
   */
  async getTrendingHashtags(locationId?: string, limit: number = 10): Promise<{ tag: string, posts: number }[]> {
    try {
      const params: any = {
        limit,
        sort_by: 'trending',
        page: 1
      };

      if (locationId) {
        params.location_id = locationId;
      }

      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/hashtags/query`, { params });

      // Transform the response to match the expected format
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.map((hashtag: any) => ({
          tag: hashtag.name,
          posts: hashtag.posts_count || 0
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting trending hashtags:', error);
      throw error;
    }
  }
};
