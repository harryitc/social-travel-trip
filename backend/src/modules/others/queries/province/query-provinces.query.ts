import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ProvinceRepository } from '../../repositories/province.repository';
import { QueryProvinceDto } from '../../dto/province.dto';
import { Province } from '../../models/others.model';

export class QueryProvincesQuery implements IQuery {
  constructor(
    public readonly dto: QueryProvinceDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(QueryProvincesQuery)
export class QueryProvincesQueryHandler
  implements IQueryHandler<QueryProvincesQuery>
{
  private readonly logger = new Logger(QueryProvincesQuery.name);

  constructor(private readonly repository: ProvinceRepository) {}

  async execute(query: QueryProvincesQuery): Promise<any> {
    const { dto } = query;

    // Query provinces with pagination
    const result = await this.repository.findAll(dto);
    
    return {
      data: result.data.rows.map(row => new Province(row)),
      total: result.total,
      page: dto.page || 1,
      limit: dto.limit || 10,
    };
  }
}
