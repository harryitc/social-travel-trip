import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { MiniBlogComment } from '../models/mini-blog.model';
import { GetMiniBlogCommentsDTO } from '../dto/get-mini-blog-comments.dto';

export class GetMiniBlogCommentsQuery implements IQuery {
  constructor(
    public readonly data: GetMiniBlogCommentsDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMiniBlogCommentsQuery)
export class GetMiniBlogCommentsQueryHandler implements IQueryHandler<GetMiniBlogCommentsQuery> {
  constructor(private readonly repository: MiniBlogRepository) {}

  async execute(query: GetMiniBlogCommentsQuery) {
    const { data } = query;
    const result = await this.repository.getCommentsByMiniBlogId(data.miniBlogId);

    if (result.rowCount === 0) {
      return {
        data: [],
        meta: {
          total: 0,
        },
      };
    }

    const comments = result.rows.map((row) => ({
      id: row.id,
      message: row.message,
      json_data: row.json_data,
      user_id: row.user_id,
      created_at: row.created_at,
      replies: row.replies || [],
    }));

    return {
      data: comments,
      meta: {
        total: comments.length,
      },
    };
  }
}
