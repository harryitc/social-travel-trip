import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import {
  Post,
  PostAuthor,
  CreatePostPayload,
  PostQueryParams,
  PostQueryResponse,
} from '../models/post.model';

/**
 * Service for handling posts
 */
export const postService = {
  /**
   * Create a new post
   * @param payload Post creation payload
   * @param files Optional files to upload
   * @returns Promise with created post
   */
  async createPost(payload: CreatePostPayload): Promise<Post> {
    try {
      // Create post
      const response = await Http.post(`${API_ENDPOINT.social_travel_trip}/posts/create`, payload);
      return new Post(response);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * Get posts with optional filtering
   * @param params Query parameters
   * @returns Promise with posts
   */
  async getPosts(params: PostQueryParams = {}): Promise<PostQueryResponse> {
    try {
      // Backend expect params directly, not wrapped in params object
      const response = await Http.post(`${API_ENDPOINT.social_travel_trip}/posts/query`, params);
      return PostQueryResponse.fromResponse(response);
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  /**
   * Get post details
   * @param postId Post ID
   * @returns Promise with post details
   */
  async getPostDetails(postId: string): Promise<Post> {
    try {
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/posts/detail`, {
        params: { postId: postId },
      });
      return new Post(response);
    } catch (error) {
      console.error('Error getting post details:', error);
      throw error;
    }
  },

  /**
   * Like a post (toggle like/unlike)
   * @param postId Post ID
   * @returns Promise with success status
   */
  async likePost(postId: string, reactionId: number): Promise<{ success: boolean }> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/posts/like`, {
        postId: postId,
        reactionId: reactionId
      });
      return { success: true };
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  /**
   * Get users who liked a post with detailed reaction info
   * @param postId Post ID
   * @returns Promise with detailed likes data
   */
  async getPostLikes(postId: string): Promise<{
    total: number;
    reactions: { reaction_id: number; count: number }[];
    users: (PostAuthor & { reaction_id: number})[];
  }> {
    try {
      const response: any = await Http.get(`${API_ENDPOINT.social_travel_trip}/posts/get-post-likes`, {
        params: { postId: postId },
      });

      return {
        total: response.total || 0,
        reactions: response.reactions || [],
        users: Array.isArray(response.users)
          ? response.users.map((user: any) => ({
              ...new PostAuthor(user),
              reaction_id: user.reaction_id,
            }))
          : []
      };
    } catch (error) {
      console.error('Error getting post likes:', error);
      throw error;
    }
  },

  /**
   * Get users who reacted to a post
   * @param postId Post ID
   * @param reactionId Optional reaction ID to filter by
   * @returns Promise with users who reacted to the post
   */
  async getPostReactionUsers(postId: string, reactionId?: number): Promise<{
    data: (PostAuthor & { reaction_id: number })[];
    meta: { total: number };
  }> {
    try {
      const params: any = { postId: postId };
      if (reactionId) {
        params.reactionId = reactionId;
      }

      const response: any = await Http.get(`${API_ENDPOINT.social_travel_trip}/posts/reaction-users`, {
        params
      });

      return {
        data: Array.isArray(response.data)
          ? response.data.map((user: any) => ({
              ...new PostAuthor(user),
              reaction_id: user.reaction_id,
            }))
          : Array.isArray(response)
          ? response.map((user: any) => ({
              ...new PostAuthor(user),
              reaction_id: user.reaction_id,
            }))
          : [],
        meta: response.meta || { total: response.length || 0 }
      };
    } catch (error) {
      console.error('Error getting post reaction users:', error);
      throw error;
    }
  },



  /**
   * Update a post
   * @param postId Post ID
   * @param payload Update payload
   * @returns Promise with updated post
   */
  async updatePost(postId: string, payload: Partial<CreatePostPayload>): Promise<Post> {
    try {
      const response = await Http.post(`${API_ENDPOINT.social_travel_trip}/posts/update`, {
        postId: postId,
        ...payload,
      });
      return new Post(response);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },
};
