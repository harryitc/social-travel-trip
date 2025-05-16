---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/commands/delete-many-<%= h.changeCase.kebabCase(moduleName)%>.command.ts
---
<% if (featureToGenerate.includes('Delete_By_Id')) { %>  
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { LogicErrorException } from '@common/exceptions';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
<% if (enableORM == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
<% } %>
<% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository';
<% } %>

export class DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command implements ICommand {
  constructor(public readonly arrayIds:Array<<%=  h.toTSDatatype(idField[1]) %>>) {}
}

@CommandHandler(DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command)
export class DeleteMany<%= h.changeCase.pascalCase(moduleName)%>CommandHandler
  implements ICommandHandler<DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command>
{
  private readonly logger = new Logger(DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command.name);

  constructor(
    <% if (enableORM == 'yes') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
    <% } %>
    <% if (enableORM == 'no') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>Repository, 
    <% } %>
  ) {}

  execute = async (command: DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command): Promise<any> => {
    const deleteQueryResult = await this.repository.deleteManyByIds(command.arrayIds);
    <% if (enableORM == 'yes') { %>
    return {
      success: deleteQueryResult.row.length !== 0,
      affected: deleteQueryResult.affected,
      raws: deleteQueryResult.row.map((element) => new <%= h.changeCase.pascalCase(moduleName)%>Model(element).getDeleteManyResponse),
    }
        <% } %>
    <% if (enableORM == 'no') { %>
    return {
      success: deleteQueryResult.rows.length !== 0,
      affected: deleteQueryResult.rows.length,
      raws: deleteQueryResult.rows.map((element) => new <%= h.changeCase.pascalCase(moduleName)%>Model(element).getDeleteManyResponse),
    }
    <% } %>
  };
}
<% } %>