import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { GetMiniBlogCommentLikesDTO } from '../dto/get-mini-blog-comments.dto';

export class GetMiniBlogCommentLikesQuery implements IQuery {
  constructor(
    public readonly data: GetMiniBlogCommentLikesDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMiniBlogCommentLikesQuery)
export class GetMiniBlogCommentLikesQueryHandler implements IQueryHandler<GetMiniBlogCommentLikesQuery> {
  constructor(private readonly repository: MiniBlogRepository) {}

  async execute(query: GetMiniBlogCommentLikesQuery) {
    const { data } = query;
    const result = await this.repository.getLikesByCommentId(data.commentId);

    if (result.rowCount === 0) {
      return {
        total: 0,
        reactions: [],
      };
    }

    // Calculate total likes across all reaction types
    const total = result.rows.reduce(
      (sum, row) => sum + Number(row.count),
      0,
    );

    return {
      total,
      reactions: result.rows, // [{ reaction_id: 2, count: 5 }, ...]
    };
  }
}
