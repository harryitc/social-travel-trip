import { CreateMiniBlogDTO } from '../dto/create-mini-blog.dto';
import { CreateMiniBlogCommentDTO } from '../dto/create-mini-blog-comment.dto';

export class MiniBlog {
  mini_blog_id: number;
  title: string;
  slug: string;
  description: string;
  day_travel: string;
  location: any;
  thumbnail_url: string;
  json_data: any;
  created_at: Date;
  updated_at: Date;
  user_id: number;

  constructor(partial: Partial<MiniBlog>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): MiniBlog {
    return new MiniBlog({
      ...row,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
  }

  static create(miniBlog: CreateMiniBlogDTO): CreateMiniBlogDTO {
    return {
      title: miniBlog.title,
      slug: miniBlog.slug ?? '',
      description: miniBlog.description ?? '',
      dayTravel: miniBlog.dayTravel ?? '',
      location: miniBlog.location ?? null,
      thumbnailUrl: miniBlog.thumbnailUrl ?? '',
      jsonData: miniBlog.jsonData ?? null,
    };
  }
}

export class MiniBlogShare {
  mini_blog_id: number;
  platform: string;
  share_data: any;
  created_at: Date;
  user_id: number;

  constructor(partial: Partial<MiniBlogShare>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): MiniBlogShare {
    return new MiniBlogShare({
      ...row,
      created_at: new Date(row.created_at),
    });
  }
}

export class MiniBlogShareable {
  mini_blog_shareable_id: number;
  title: string;
  description: string;
  is_show_map: boolean;
  is_show_timeline: boolean;
  created_at: Date;
  updated_at: Date;
  mini_blog_id: number;

  constructor(partial: Partial<MiniBlogShareable>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): MiniBlogShareable {
    return new MiniBlogShareable({
      ...row,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
  }
}

export class MiniBlogComment {
  mini_blog_comment_id: number;
  message: string;
  json_data: any;
  created_at: Date;
  updated_at: Date;
  mini_blog_id: number;
  user_id: number;
  parent_id: number | null;
  replies?: MiniBlogComment[];

  constructor(partial: Partial<MiniBlogComment>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): MiniBlogComment {
    return new MiniBlogComment({
      ...row,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      replies: row.replies ? row.replies.map(reply => MiniBlogComment.fromRow(reply)) : [],
    });
  }

  static create(comment: CreateMiniBlogCommentDTO): CreateMiniBlogCommentDTO {
    return {
      miniBlogId: comment.miniBlogId,
      parentId: comment.parentId ?? null,
      message: comment.message,
      jsonData: comment.jsonData ?? null,
    };
  }
}

export class MiniBlogCommentLike {
  mini_blog_comment_id: number;
  user_id: number;
  reaction_id: number;
  created_at: Date;

  constructor(partial: Partial<MiniBlogCommentLike>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): MiniBlogCommentLike {
    return new MiniBlogCommentLike({
      ...row,
      created_at: new Date(row.created_at),
    });
  }
}

export class MiniBlogLike {
  mini_blog_id: number;
  user_id: number;
  reaction_id: number;
  created_at: Date;

  constructor(partial: Partial<MiniBlogLike>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): MiniBlogLike {
    return new MiniBlogLike({
      ...row,
      created_at: new Date(row.created_at),
    });
  }
}