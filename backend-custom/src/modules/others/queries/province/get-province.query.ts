import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ProvinceRepository } from '../../repositories/province.repository';
import { GetProvinceDto } from '../../dto/province.dto';
import { Province } from '../../models/others.model';

export class GetProvinceQuery implements IQuery {
  constructor(
    public readonly dto: GetProvinceDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetProvinceQuery)
export class GetProvinceQueryHandler
  implements IQueryHandler<GetProvinceQuery>
{
  private readonly logger = new Logger(GetProvinceQuery.name);

  constructor(private readonly repository: ProvinceRepository) {}

  async execute(query: GetProvinceQuery): Promise<any> {
    const { dto } = query;

    // Get province by ID
    const result = await this.repository.findById(dto.province_id);
    
    if (result.rowCount === 0) {
      throw new NotFoundException(`Province with ID ${dto.province_id} not found`);
    }
    
    return new Province(result.rows[0]);
  }
}
