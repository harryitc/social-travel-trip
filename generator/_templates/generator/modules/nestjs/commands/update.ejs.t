---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/commands/update-<%= h.changeCase.kebabCase(moduleName)%>.command.ts
---
<% if (featureToGenerate.includes('Update_One')) { %>
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
<% if (enableORM == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
<% } %>
<% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository';
<% } %>

export class Update<%= h.changeCase.pascalCase(moduleName)%>Command implements ICommand {
  constructor(public readonly agrs: {
    <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>,
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    <%= entityAttributes[i]%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
  }) {}
}

@CommandHandler(Update<%= h.changeCase.pascalCase(moduleName)%>Command)
export class Update<%= h.changeCase.pascalCase(moduleName)%>CommandHandler
  implements ICommandHandler<Update<%= h.changeCase.pascalCase(moduleName)%>Command>
{
  constructor(
    <% if (enableORM == 'yes') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
    <% } %>
    <% if (enableORM == 'no') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>Repository, 
    <% } %>
  ) {}

  execute = async (command: Update<%= h.changeCase.pascalCase(moduleName)%>Command): Promise<any> => {
    await this.repository.update(command.agrs);
    return Promise.resolve(new <%= h.changeCase.pascalCase(moduleName)%>Model({<%= idField[0]%>: command.agrs.<%= idField[0]%>}).getUpdatedResponse);
  };
}
<% } %>