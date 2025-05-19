import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { MiniBlog } from '../models/mini-blog.model';
import { GetMiniBlogDTO } from '../dto/get-mini-blog.dto';

export class GetMiniBlogsQuery implements IQuery {
  constructor(
    public readonly filterDTO: GetMiniBlogDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMiniBlogsQuery)
export class GetMiniBlogsQueryHandler implements IQueryHandler<GetMiniBlogsQuery> {
  constructor(private readonly repository: MiniBlogRepository) {}

  async execute(query: GetMiniBlogsQuery) {
    const [queryResult, count] = await Promise.all([
      this.repository.getMiniBlogList(),
      this.repository.getCountMiniBlog(),
    ]);

    if (queryResult.rowCount == 0) {
      throw new NotFoundException(`No mini blogs found`);
    }

    const blogs = queryResult.rows.map((row) => MiniBlog.fromRow(row));
    const totalCount = parseInt(count.rows[0].count);

    return {
      data: blogs,
      meta: {
        total: totalCount,
      },
    };
  }
}
