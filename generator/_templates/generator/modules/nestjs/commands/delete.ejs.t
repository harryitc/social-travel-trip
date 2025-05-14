---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/commands/delete-<%= h.changeCase.kebabCase(moduleName)%>.command.ts
---
<% if (featureToGenerate.includes('Delete_By_Id')) { %>  
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { LogicErrorException } from '@common/exceptions';
<% if (enableORM == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
<% } %>
<% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository';
<% } %>

export class Delele<%= h.changeCase.pascalCase(moduleName)%>Command implements ICommand {
  constructor(public readonly <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) {}
}

@CommandHandler(Delele<%= h.changeCase.pascalCase(moduleName)%>Command)
export class Delele<%= h.changeCase.pascalCase(moduleName)%>CommandHandler
  implements ICommandHandler<Delele<%= h.changeCase.pascalCase(moduleName)%>Command>
{
  private readonly logger = new Logger(Delele<%= h.changeCase.pascalCase(moduleName)%>Command.name);

  constructor(
    <% if (enableORM == 'yes') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
    <% } %>
    <% if (enableORM == 'no') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>Repository, 
    <% } %>
  ) {}

  execute = async (command: Delele<%= h.changeCase.pascalCase(moduleName)%>Command): Promise<any> => {
    await this.repository.delete(command.<%= idField[0]%>);
  };
}
<% } %>