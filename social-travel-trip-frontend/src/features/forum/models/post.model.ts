import { get } from 'lodash';

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

export class Location {
  name: string;
  description: string;
  lon: number;
  lat: number;

  constructor(data: any) {
    this.name = get(data, 'name', '');
    this.description = get(data, 'description', '');
    this.lon = get(data, 'lon', 0);
    this.lat = get(data, 'lat', 0);
  }
}

export class ReactionCountModel {
  reaction_id: number;
  count: number;
  constructor(data: any) {
    this.reaction_id = get(data, 'reaction_id', 1);
    this.count = get(data, 'count', 0);
  }
}

export class PostStats {
  total_likes: number;
  total_comments: number;
  reactions: ReactionCountModel[];
  user_reaction: number | null; // Add user reaction
  constructor(data: any) {
    this.total_likes = get(data, 'total_likes', 0);
    this.total_comments = get(data, 'total_comments', 0);
    this.reactions = get(data, 'reactions', [])?.map(
      (reaction: any) => new ReactionCountModel(reaction),
    );
    this.user_reaction = get(data, 'user_reaction', null);
  }
}

/**
 * Post model
 */
export class Post {
  post_id: string;
  content: string;
  images: string[];
  location!: Location;
  hashtags: string[];
  mentions: PostMention[];
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  stats: PostStats;

  constructor(data: any) {
    this.post_id = get(data, 'post_id', -1);
    this.content = get(data, 'content', '');
    this.images = get(data, 'images', []);
    this.hashtags = get(data, 'hashtags', []);
    this.mentions = get(data, 'mentions', [])?.map((mention: any) => new PostMention(mention));
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.author = new PostAuthor(data?.user);
    this.location = new Location(data?.location);
    this.stats = new PostStats(data?.stats);
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

    this.data = get(data, 'data', []).map((item: any) => new Post(item));
    this.total = get(data, 'total', 0);
    this.page = get(data, 'page', 1);
    this.limit = get(data, 'limit', 10);
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
  search?: string;

  constructor(data: any = {}) {
    this.page = data.page;
    this.limit = data.limit;
    this.sort_by = data.sort_by;
    this.hashtag = data.hashtag;
    this.location_id = data.location_id;
    this.search = data.search;
  }
}
