import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ReactionRepository } from '../../repositories/reaction.repository';
import { QueryReactionDto } from '../../dto/reaction.dto';
import { Reaction } from '../../models/others.model';

export class QueryReactionsQuery implements IQuery {
  constructor(
    public readonly dto: QueryReactionDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(QueryReactionsQuery)
export class QueryReactionsQueryHandler
  implements IQueryHandler<QueryReactionsQuery>
{
  private readonly logger = new Logger(QueryReactionsQuery.name);

  constructor(private readonly repository: ReactionRepository) {}

  async execute(query: QueryReactionsQuery): Promise<any> {
    const { dto } = query;

    // Query reactions with pagination
    const result = await this.repository.findAll(dto);
    
    return {
      data: result.data.rows.map(row => new Reaction(row)),
      total: result.total,
      page: dto.page || 1,
      limit: dto.limit || 10,
    };
  }
}
