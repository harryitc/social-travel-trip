import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';

export interface UserProfile {
  user_id: number;
  username: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: boolean;
  address?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfilePayload {
  user_id: number;
  full_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: boolean | null;
  address?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  user_id: number;
  old_password: string;
  new_password: string;
}

/**
 * Service for handling user profile operations
 */
export const profileService = {
  /**
   * Get current user profile details
   * @returns Promise with user profile
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const response: any = await Http.get(`${API_ENDPOINT.social_travel_trip}/user/details`);
      return response;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param payload Profile update data
   * @returns Promise with updated profile
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/user/update`, payload);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param payload Password change data
   * @returns Promise with success response
   */
  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/user/change-password`, payload);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};
