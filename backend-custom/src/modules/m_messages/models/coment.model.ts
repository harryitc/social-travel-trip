export class PostComment {
  post_comment_id: number;
  content: string;
  json_data: any;
  comment_shared_id: number | null;
  created_at: Date;
  updated_at: Date;
  parent_id: number | null;
  user_id: number;
  post_id: number;

  constructor(partial: Partial<PostComment>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): PostComment {
    return new PostComment({
      ...row,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
  }
}

export class PostCommentLike {
  post_comment_like_id: number;
  reaction_id: number;
  comment_id: number;
  user_id: number;

  constructor(partial: Partial<PostCommentLike>) {
    Object.assign(this, partial);
  }

  static fromRow(row: any): PostCommentLike {
    return new PostCommentLike(row);
  }
}
