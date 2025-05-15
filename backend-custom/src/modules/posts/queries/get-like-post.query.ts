import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { PostRepository } from '../repositories/post.repository';
import { Post } from '../models/post.model';

export class GetLikesPostQuery implements IQuery {
  constructor(
    public readonly filterDTO: any,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetLikesPostQuery)
export class GetLikesPostQueryHandler implements IQueryHandler<GetLikesPostQuery> {
  constructor(private readonly repository: PostRepository) {}

  async execute(query: GetLikesPostQuery) {
    // const { page, perPage, filters, sorts } = query.filterDTO;

    // const queryObject = {
    //   pageSize: CustomQueryHelper.extractPageSize(page, perPage), // litmit, offset
    //   filters: CustomQueryHelper.extractFilter(filters), // { key: value123 }
    //   sorts: CustomQueryHelper.extractSort(sorts), // [{filed: product_name: order: desc/asc}]

    //   // Additional data to query...
    //   // ownerId: query?.userId ?? 0,
    // };

    const [queryResult, count] = await Promise.all([
      this.repository.getPosts(),
      this.repository.getCountPosts(),
    ]);

    if (queryResult.rowCount === 0) {
      throw new NotFoundException(`Record by filter not found`);
    }

    const result = {
      list: queryResult.rows.map((item: any) => new Post(item)),
      total: count.rows[0].count ?? 0,
    };

    return result;
  }
}
