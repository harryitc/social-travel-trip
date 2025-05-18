import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { CategoryRepository } from '../../repositories/category.repository';
import { GetCategoryDto } from '../../dto/category.dto';
import { Category } from '../../models/others.model';

export class GetCategoryQuery implements IQuery {
  constructor(
    public readonly dto: GetCategoryDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetCategoryQuery)
export class GetCategoryQueryHandler
  implements IQueryHandler<GetCategoryQuery>
{
  private readonly logger = new Logger(GetCategoryQuery.name);

  constructor(private readonly repository: CategoryRepository) {}

  async execute(query: GetCategoryQuery): Promise<any> {
    const { dto } = query;

    // Get category by ID
    const result = await this.repository.findById(dto.category_id);
    
    if (result.rowCount === 0) {
      throw new NotFoundException(`Category with ID ${dto.category_id} not found`);
    }
    
    return new Category(result.rows[0]);
  }
}
