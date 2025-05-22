import { get } from 'lodash';
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
    this.comment_id = get(data, 'comment_id', -1);
    this.post_id = get(data, 'post_id', -1);
    this.content = get(data, 'content', '');
    this.parent_id = get(data, 'parent_id', null);
    this.created_at = get(data, 'created_at', '');
    this.updated_at = get(data, 'updated_at', '');
    this.author = new PostAuthor(data?.author);
    this.likes_count = get(data, 'likes_count', 0);
    this.is_liked = get(data, 'is_liked', false);
    this.replies = get(data, 'replies', [])?.map((reply: any) => new Comment(reply));
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
    this.post_id = get(data, 'post_id', -1);
    this.content = get(data, 'content', '');
    this.parent_id = get(data, 'parent_id', null);
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
    this.user_id = get(data, 'user_id', -1);
    this.username = get(data, 'username', '');
    this.full_name = get(data, 'full_name', '');
    this.avatar = get(data, 'avatar_url', '');
    this.reaction_id = get(data, 'reaction_id', -1);
  }
}
