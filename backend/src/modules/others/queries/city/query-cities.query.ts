import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { CityRepository } from '../../repositories/city.repository';
import { QueryCityDto } from '../../dto/city.dto';
import { City } from '../../models/others.model';

export class QueryCitiesQuery implements IQuery {
  constructor(
    public readonly dto: QueryCityDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(QueryCitiesQuery)
export class QueryCitiesQueryHandler
  implements IQueryHandler<QueryCitiesQuery>
{
  private readonly logger = new Logger(QueryCitiesQuery.name);

  constructor(private readonly repository: CityRepository) {}

  async execute(query: QueryCitiesQuery): Promise<any> {
    const { dto } = query;

    // Query cities with pagination
    const result = await this.repository.findAll(dto);
    
    return {
      data: result.data.rows.map(row => new City({
        ...row,
        province_name: row.province_name,
      })),
      total: result.total,
      page: dto.page || 1,
      limit: dto.limit || 10,
    };
  }
}
