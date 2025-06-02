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
  stats: {
    total_likes: number;
    user_reaction?: number | null;
    reactions: { reaction_id: number; count: number }[];
  };
  replies?: Comment[];

  constructor(data: any) {
    this.comment_id = get(data, 'id', get(data, 'comment_id', -1)).toString();
    this.post_id = get(data, 'post_id', -1).toString();
    this.content = get(data, 'content', '');
    this.parent_id = get(data, 'parent_id', null)?.toString();
    this.created_at = get(data, 'created_at', '');
    this.updated_at = get(data, 'updated_at', '');
    this.author = new PostAuthor(data?.user || data?.author);
    this.stats = {
      total_likes: get(data, 'stats.total_likes', 0),
      user_reaction: get(data, 'stats.user_reaction', null),
      reactions: get(data, 'stats.reactions', [])
    };
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
  jsonData?: any;

  constructor(data: any) {
    this.post_id = get(data, 'post_id', -1).toString();
    this.content = get(data, 'content', '');
    this.parent_id = get(data, 'parent_id', null)?.toString();
    this.jsonData = get(data, 'jsonData', {});
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
