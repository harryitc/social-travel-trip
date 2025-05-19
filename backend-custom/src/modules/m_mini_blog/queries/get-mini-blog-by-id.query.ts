import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { MiniBlog } from '../models/mini-blog.model';
import { GetMiniBlogByIdDTO } from '../dto/get-mini-blog.dto';

export class GetMiniBlogByIdQuery implements IQuery {
  constructor(
    public readonly data: GetMiniBlogByIdDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMiniBlogByIdQuery)
export class GetMiniBlogByIdQueryHandler implements IQueryHandler<GetMiniBlogByIdQuery> {
  constructor(private readonly repository: MiniBlogRepository) {}

  async execute(query: GetMiniBlogByIdQuery) {
    const { data } = query;
    const result = await this.repository.getMiniBlogById(data.miniBlogId);

    if (result.rowCount == 0) {
      throw new NotFoundException(`Mini blog with ID ${data.miniBlogId} not found`);
    }

    const blog = MiniBlog.fromRow(result.rows[0]);

    return {
      data: blog,
    };
  }
}
