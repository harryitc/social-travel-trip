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

export interface ProfileStats {
  user_id: number;
  completion_percentage: number;
  profile_views: number;
  posts_count: number;
  followers_count: number;
  following_count: number;
  groups_count: number;
  trips_count: number;
  last_active?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileWithStats {
  user: UserProfile;
  stats: ProfileStats;
  recent_views?: any[];
  formattedStats?: {
    completion: {
      percentage: number;
      status: string;
      color: string;
    };
    activity: {
      profile_views: number;
      posts_count: number;
      last_active?: string;
    };
    social: {
      followers_count: number;
      following_count: number;
      groups_count: number;
    };
    travel: {
      trips_count: number;
    };
  };
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

  /**
   * Get user profile statistics
   * @param includeActivity Whether to include recent activity data
   * @returns Promise with profile statistics
   */
  async getProfileStats(includeActivity: boolean = false): Promise<UserProfileWithStats> {
    try {
      const response: any = await Http.get(`${API_ENDPOINT.social_travel_trip}/user/profile-stats?include_activity=${includeActivity}`);
      return response;
    } catch (error) {
      console.error('Error getting profile stats:', error);
      throw error;
    }
  },

  /**
   * Record a profile view
   * @param profileOwnerId ID of the profile being viewed
   * @returns Promise with success response
   */
  async recordProfileView(profileOwnerId: number): Promise<any> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/user/record-profile-view/${profileOwnerId}`, {
        profileOwnerId
      });
      return response;
    } catch (error) {
      console.error('Error recording profile view:', error);
      throw error;
    }
  },
};
