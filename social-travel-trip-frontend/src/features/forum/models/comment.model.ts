import { PostAuthor } from './post.model';

/**
 * Comment model
 */
export class Comment {
  comment_id: string;
  post_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  likes_count: number;
  is_liked: boolean;
  replies?: Comment[];

  constructor(data: any) {
    this.comment_id = data.comment_id;
    this.post_id = data.post_id;
    this.content = data.content;
    this.parent_id = data.parent_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.author = new PostAuthor(data.author);
    this.likes_count = data.likes_count || 0;
    this.is_liked = data.is_liked || false;
    
    // Handle replies recursively
    if (Array.isArray(data.replies)) {
      this.replies = data.replies.map((reply: any) => new Comment(reply));
    }
  }

  /**
   * Create a Comment instance from API response
   * @param data API response data
   * @returns Comment instance
   */
  static fromResponse(data: any): Comment {
    return new Comment(data);
  }

  /**
   * Create an array of Comment instances from API response
   * @param data API response data
   * @returns Array of Comment instances
   */
  static fromResponseArray(data: any[]): Comment[] {
    return data.map(item => Comment.fromResponse(item));
  }
}

/**
 * Comment creation payload model
 */
export class CreateCommentPayload {
  post_id: string;
  content: string;
  parent_id?: string;

  constructor(data: any) {
    this.post_id = data.post_id;
    this.content = data.content;
    this.parent_id = data.parent_id;
  }
}

/**
 * User who reacted to a comment
 */
export class CommentReactionUser {
  user_id: string;
  username: string;
  full_name: string;
  avatar?: string;
  reaction_id: string;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.username = data.username;
    this.full_name = data.full_name;
    this.avatar = data.avatar;
    this.reaction_id = data.reaction_id;
  }

  /**
   * Create a CommentReactionUser instance from API response
   * @param data API response data
   * @returns CommentReactionUser instance
   */
  static fromResponse(data: any): CommentReactionUser {
    return new CommentReactionUser(data);
  }

  /**
   * Create an array of CommentReactionUser instances from API response
   * @param data API response data
   * @returns Array of CommentReactionUser instances
   */
  static fromResponseArray(data: any[]): CommentReactionUser[] {
    return data.map(item => CommentReactionUser.fromResponse(item));
  }
}
