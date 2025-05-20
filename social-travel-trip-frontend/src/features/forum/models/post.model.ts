import { get } from "lodash";

/**
 * Post author model
 */
export class PostAuthor {
  user_id: string;
  username: string;
  full_name: string;
  avatar?: string;

  constructor(data: any) {
    this.user_id = get(data, 'user_id', -1);
    this.username = get(data, 'username', '');
    this.full_name = get(data, 'full_name', '');
    this.avatar = get(data, 'avatar_url', '');
  }
}

/**
 * Post mention model
 */
export class PostMention {
  user_id: string;
  username: string;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.username = data.username;
  }
}

/**
 * Post model
 */
export class Post {
  post_id: string;
  content: string;
  images: string[];
  location_id?: string;
  location_name?: string;
  hashtags: string[];
  mentions: PostMention[];
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;

  constructor(data: any) {
    this.post_id = get(data, 'post_id', -1);
    this.content = get(data, 'content', '');
    this.images = get(data, 'images', []);
    this.location_id = get(data, 'location_id', -1);
    this.location_name = get(data, 'location_name', '');
    this.hashtags = get(data, 'hashtags', []);
    this.mentions = get(data, 'mentions', [])?.map((mention: any) => new PostMention(mention));
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.author = new PostAuthor(data.user);
    this.likes_count = data.likes_count || 0;
    this.comments_count = data.comments_count || 0;
    this.is_liked = data.is_liked || false;
  }

  /**
   * Create a Post instance from API response
   * @param data API response data
   * @returns Post instance
   */
  static fromResponse(data: any): Post {
    return new Post(data);
  }

  /**
   * Create an array of Post instances from API response
   * @param data API response data
   * @returns Array of Post instances
   */
  static fromResponseArray(data: any[]): Post[] {
    return data.map(item => Post.fromResponse(item));
  }
}

/**
 * Post query response model
 */
export class PostQueryResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;

  constructor(data: any) {
    console.log(data);
    this.data = Array.isArray(data.data) 
      ? data.data.map((post: any) => Post.fromResponse(post))
      : [];
    this.total = data.total || 0;
    this.page = data.page || 1;
    this.limit = data.limit || 10;
  }

  /**
   * Create a PostQueryResponse instance from API response
   * @param data API response data
   * @returns PostQueryResponse instance
   */
  static fromResponse(data: any): PostQueryResponse {
    return new PostQueryResponse(data);
  }
}

/**
 * Post creation payload model
 */
export class CreatePostPayload {
  content: string;
  images?: string[];
  location_id?: string;
  location_name?: string;
  hashtags?: string[];
  mentions?: string[];

  constructor(data: any) {
    this.content = data.content;
    this.images = data.images;
    this.location_id = data.location_id;
    this.location_name = data.location_name;
    this.hashtags = data.hashtags;
    this.mentions = data.mentions;
  }
}

/**
 * Post query parameters model
 */
export class PostQueryParams {
  page?: number;
  limit?: number;
  sort_by?: 'newest' | 'trending' | 'following';
  hashtag?: string;
  location_id?: string;

  constructor(data: any = {}) {
    this.page = data.page;
    this.limit = data.limit;
    this.sort_by = data.sort_by;
    this.hashtag = data.hashtag;
    this.location_id = data.location_id;
  }
}
