import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';

export interface UserSearchResult {
  user_id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
}

export interface SearchUsersResponse {
  data: UserSearchResult[];
  total: number;
}

export interface SearchUsersParams {
  search_term?: string;
  page?: number;
  limit?: number;
  autocomplete?: boolean;
}

class UserSearchService {
  /**
   * Search users with autocomplete support
   */
  async searchUsers(params: SearchUsersParams): Promise<SearchUsersResponse> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/user/search`, {
        search_term: params.search_term,
        page: params.page || 1,
        limit: params.limit || 10,
        autocomplete: params.autocomplete || false,
      });

      return response;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Search users for autocomplete (optimized for performance)
   */
  async searchUsersAutocomplete(searchTerm: string, limit: number = 5): Promise<UserSearchResult[]> {
    try {
      const response = await this.searchUsers({
        search_term: searchTerm,
        limit,
        autocomplete: true,
      });

      return response.data;
    } catch (error) {
      console.error('Error searching users for autocomplete:', error);
      throw error;
    }
  }

  /**
   * Get user by username or email
   */
  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<UserSearchResult | null> {
    try {
      const response = await this.searchUsers({
        search_term: usernameOrEmail,
        limit: 1,
      });

      // Find exact match
      const exactMatch = response.data.find(user => 
        user.username === usernameOrEmail || user.email === usernameOrEmail
      );

      return exactMatch || null;
    } catch (error) {
      console.error('Error getting user by username or email:', error);
      throw error;
    }
  }
}

export const userSearchService = new UserSearchService();
