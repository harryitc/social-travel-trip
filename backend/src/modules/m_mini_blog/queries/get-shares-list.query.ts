import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { MiniBlogShareable } from '../models/mini-blog.model';
import { GetSharesListDTO } from '../dto/share-mini-blog.dto';

export class GetSharesListQuery implements IQuery {
  constructor(
    public readonly data: GetSharesListDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetSharesListQuery)
export class GetSharesListQueryHandler implements IQueryHandler<GetSharesListQuery> {
  constructor(private readonly repository: MiniBlogRepository) {}

  async execute(query: GetSharesListQuery) {
    const { data } = query;
    const result = await this.repository.getSharesList(data.miniBlogId);

    const shares = result.rows.map((row) => MiniBlogShareable.fromRow(row));

    return {
      data: shares,
      meta: {
        total: shares.length,
      },
    };
  }
}
