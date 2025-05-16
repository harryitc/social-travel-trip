import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { CommentRepository } from '../repositories/comment.repository';

export class GetCommentByPostQuery implements IQuery {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetCommentByPostQuery)
export class GetCommentByPostQueryHandler
  implements IQueryHandler<GetCommentByPostQuery>
{
  constructor(private readonly repository: CommentRepository) {}

  async execute(query: GetCommentByPostQuery) {
    // const { page, perPage, filters, sorts } = query.filterDTO;

    // const queryObject = {
    //   pageSize: CustomQueryHelper.extractPageSize(page, perPage), // litmit, offset
    //   filters: CustomQueryHelper.extractFilter(filters), // { key: value123 }
    //   sorts: CustomQueryHelper.extractSort(sorts), // [{filed: product_name: order: desc/asc}]

    //   // Additional data to query...
    //   // ownerId: query?.userId ?? 0,
    // };

    // const [queryResult, count] = await Promise.all([
    //   this.repository.getComments(query.postId),
    //   this.repository.getCountComments(query.postId),
    // ]);
    const queryResult = await this.repository.getComments(query.postId);

    if (queryResult.rowCount == 0) {
      throw new NotFoundException(`Record by filter not found`);
    }

    return queryResult.rows;
  }
}
