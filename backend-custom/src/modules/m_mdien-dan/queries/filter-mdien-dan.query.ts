import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';
import { CustomQueryHelper } from '@common/helpers/custom-api-query';
import { FilterMdienDanDTO } from '../dto/filter-mdien-dan.dto';
import { MdienDanModel } from '../models/mdien-dan.model';



import { MdienDanRepository } from '../repositories/mdien-dan.repository';


export class FilterMdienDanQuery implements IQuery {
  constructor(
    public readonly filterDTO: FilterMdienDanDTO,
  ) {}
}

@QueryHandler(FilterMdienDanQuery)
export class FilterMdienDanQueryHandler
  implements IQueryHandler<FilterMdienDanQuery>
{
  constructor(
    
    
    private readonly repository: MdienDanRepository, 
    
  ) {}

  async execute(query: FilterMdienDanQuery) {
    const { page, perPage, filters, sorts } = query.filterDTO;

    const queryObject = {
      pageSize: CustomQueryHelper.extractPageSize(page, perPage), // litmit, offset
      filters: CustomQueryHelper.extractFilter(filters), // { key: value123 }
      sorts: CustomQueryHelper.extractSort(sorts), // [{filed: product_name: order: desc/asc}]

      // Additional data to query...
      // ownerId: query?.userId ?? 0,
    };

    
   
    
    const [queryResult, count] = await Promise.all([
      this.repository.getManyByFilter(queryObject),
      this.repository.countByFilter(queryObject),
    ]);
    
    
    if (queryResult.rowCount === 0) {
      throw new NotFoundException(`Record by filter not found`);
    }

    const result = {
      list: queryResult.rows.map(
        (item: any) => new MdienDanModel(item).getItemInListResponse,
      ),
      total: count.rows[0].count ?? 0,
    };

    return result;
  }
}
