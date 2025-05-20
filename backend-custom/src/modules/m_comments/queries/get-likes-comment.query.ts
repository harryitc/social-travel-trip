import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { CommentRepository } from '../repositories/comment.repository';

export class GetLikesCommentQuery implements IQuery {
  constructor(
    public readonly commentId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetLikesCommentQuery)
export class GetLikesCommentQueryHandler
  implements IQueryHandler<GetLikesCommentQuery>
{
  constructor(private readonly repository: CommentRepository) {}

  async execute(query: GetLikesCommentQuery) {
    const queryResult = await this.repository.getLikeComments(query.commentId);

    if (queryResult.rowCount == 0) {
      throw new NotFoundException(`Like Comments not found`);
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
