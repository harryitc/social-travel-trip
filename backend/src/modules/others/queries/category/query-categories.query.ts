import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { CategoryRepository } from '../../repositories/category.repository';
import { QueryCategoryDto } from '../../dto/category.dto';
import { Category } from '../../models/others.model';

export class QueryCategoriesQuery implements IQuery {
  constructor(
    public readonly dto: QueryCategoryDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(QueryCategoriesQuery)
export class QueryCategoriesQueryHandler
  implements IQueryHandler<QueryCategoriesQuery>
{
  private readonly logger = new Logger(QueryCategoriesQuery.name);

  constructor(private readonly repository: CategoryRepository) {}

  async execute(query: QueryCategoriesQuery): Promise<any> {
    const { dto } = query;

    // Query categories with pagination
    const result = await this.repository.findAll(dto);
    
    return {
      data: result.data.rows.map(row => new Category(row)),
      total: result.total,
      page: dto.page || 1,
      limit: dto.limit || 10,
    };
  }
}
