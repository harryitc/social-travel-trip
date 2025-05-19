import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { GetMiniBlogLikesDTO } from '../dto/get-mini-blog-comments.dto';

export class GetMiniBlogLikesQuery implements IQuery {
  constructor(
    public readonly data: GetMiniBlogLikesDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMiniBlogLikesQuery)
export class GetMiniBlogLikesQueryHandler implements IQueryHandler<GetMiniBlogLikesQuery> {
  constructor(private readonly repository: MiniBlogRepository) {}

  async execute(query: GetMiniBlogLikesQuery) {
    const { data } = query;
    const result = await this.repository.getLikesByMiniBlogId(data.miniBlogId);

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
