import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { CityRepository } from '../../repositories/city.repository';
import { GetCityDto } from '../../dto/city.dto';
import { City } from '../../models/others.model';

export class GetCityQuery implements IQuery {
  constructor(
    public readonly dto: GetCityDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetCityQuery)
export class GetCityQueryHandler
  implements IQueryHandler<GetCityQuery>
{
  private readonly logger = new Logger(GetCityQuery.name);

  constructor(private readonly repository: CityRepository) {}

  async execute(query: GetCityQuery): Promise<any> {
    const { dto } = query;

    // Get city by ID
    const result = await this.repository.findById(dto.city_id);
    
    if (result.rowCount == 0) {
      throw new NotFoundException(`City with ID ${dto.city_id} not found`);
    }
    
    return new City({
      ...result.rows[0],
      province_name: result.rows[0].province_name,
    });
  }
}
