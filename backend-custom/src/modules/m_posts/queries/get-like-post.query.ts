import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { PostRepository } from '../repositories/post.repository';

export class GetLikesPostQuery implements IQuery {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetLikesPostQuery)
export class GetLikesPostQueryHandler
  implements IQueryHandler<GetLikesPostQuery>
{
  constructor(private readonly repository: PostRepository) {}

  async execute(query: GetLikesPostQuery) {
    const queryResult = await this.repository.getLikePost(query.postId);

    if (queryResult.rowCount === 0) {
      throw new NotFoundException(`Like Post not found`);
    }
    // Tổng tất cả reaction
    const total = queryResult.rows.reduce(
      (sum, row) => sum + Number(row.count),
      0,
    );

    return {
      total,
      reactions: queryResult.rows, // [{ reaction_id: 2, count: 5 }, ...]
    };
  }
}
