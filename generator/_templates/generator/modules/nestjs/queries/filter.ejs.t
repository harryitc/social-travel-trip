---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/queries/filter-<%= h.changeCase.kebabCase(moduleName)%>.query.ts
---
import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { NotFoundException } from '@common/exceptions';
import { CustomQueryHelper } from '@common/helpers/custom-api-query';
import { Filter<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/filter-<%= h.changeCase.kebabCase(moduleName)%>.dto';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';

<% if (enableORM == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
<% } %>
<% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository';
<% } %>

export class Filter<%= h.changeCase.pascalCase(moduleName)%>Query implements IQuery {
  constructor(
    public readonly filterDTO: Filter<%= h.changeCase.pascalCase(moduleName)%>DTO,
  ) {}
}

@QueryHandler(Filter<%= h.changeCase.pascalCase(moduleName)%>Query)
export class Filter<%= h.changeCase.pascalCase(moduleName)%>QueryHandler
  implements IQueryHandler<Filter<%= h.changeCase.pascalCase(moduleName)%>Query>
{
  constructor(
    <% if (enableORM == 'yes') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
    <% } %>
    <% if (enableORM == 'no') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>Repository, 
    <% } %>
  ) {}

  async execute(query: Filter<%= h.changeCase.pascalCase(moduleName)%>Query) {
    const { page, perPage, filters, sorts } = query.filterDTO;

    const queryObject = {
      pageSize: CustomQueryHelper.extractPageSize(page, perPage), // litmit, offset
      filters: CustomQueryHelper.extractFilter(filters), // { key: value123 }
      sorts: CustomQueryHelper.extractSort(sorts), // [{filed: product_name: order: desc/asc}]

      // Additional data to query...
      // ownerId: query?.userId ?? 0,
    };

    <% if (enableORM == 'yes') { %>
    const [queryResult, count] = await this.repository.getManyByFilter(queryObject);
    <% } %>
   
    <% if (enableORM == 'no') { %>
    const [queryResult, count] = await Promise.all([
      this.repository.getManyByFilter(queryObject),
      this.repository.countByFilter(queryObject),
    ]);
    <% } %>
    
    if (queryResult.rowCount === 0) {
      throw new NotFoundException(`Record by filter not found`);
    }

    const result = {
      list: queryResult.rows.map(
        (item: any) => new <%= h.changeCase.pascalCase(moduleName)%>Model(item).getItemInListResponse,
      ),
      total: count.rows[0].count ?? 0,
    };

    return result;
  }
}
