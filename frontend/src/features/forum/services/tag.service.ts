import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import { HashtagModel } from '../models/hashtag.model';

/**
 * Service for handling hashtags
 */
export const hashtagService = {
  async getList(q: string): Promise<HashtagModel[]> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/hashtags/query`, {
          search: q.trim(),
      });
      return response.list.map((item: HashtagModel) => new HashtagModel(item));
    } catch (error) {
      console.error('Error getting trending hashtags:', error);
      throw error;
    }
  },
};
