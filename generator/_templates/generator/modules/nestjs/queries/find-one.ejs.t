---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/queries/find-one-<%= h.changeCase.kebabCase(moduleName)%>.query.ts
---
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
<% if (enableORM == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
<% } %>
<% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository';
<% } %>

export class FindOne<%= h.changeCase.pascalCase(moduleName)%>Query {
  constructor(public readonly <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) {}
}

@QueryHandler(FindOne<%= h.changeCase.pascalCase(moduleName)%>Query)
export class FindOne<%= h.changeCase.pascalCase(moduleName)%>QueryHandler
  implements IQueryHandler<FindOne<%= h.changeCase.pascalCase(moduleName)%>Query>
{
  constructor(
    <% if (enableORM == 'yes') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
    <% } %>
    <% if (enableORM == 'no') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>Repository, 
    <% } %>
  ) {}

  async execute(query: FindOne<%= h.changeCase.pascalCase(moduleName)%>Query) {
    const resultFounded = await this.repository.findOne(query.<%= idField[0]%>);
    if (!resultFounded.rows[0]) {
      throw new NotFoundException(`Record: ${query.<%= idField[0]%>} not found!`);
    }

    return new <%= h.changeCase.pascalCase(moduleName)%>Model(resultFounded.rows[0]).getOneResponse ;
  }
}
