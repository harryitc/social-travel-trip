import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { QueryHashtagDto } from '../../dto/hashtag.dto';
import { Hashtag } from '../../models/others.model';

export class QueryHashtagsQuery implements IQuery {
  constructor(
    public readonly dto: QueryHashtagDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(QueryHashtagsQuery)
export class QueryHashtagsQueryHandler
  implements IQueryHandler<QueryHashtagsQuery>
{
  private readonly logger = new Logger(QueryHashtagsQuery.name);

  constructor(private readonly repository: HashtagRepository) {}

  async execute(query: QueryHashtagsQuery): Promise<any> {
    const { dto } = query;

    // Query hashtags with pagination
    const result = await this.repository.findAll(dto);

    return {
      list: result.data.rows.map((row) => new Hashtag(row)),
      total: result.total,
    };
  }
}
