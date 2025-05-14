---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/commands/create-<%= h.changeCase.kebabCase(moduleName)%>.command.ts
---
<% if (featureToGenerate.includes('Create_One')) { %>
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
<% if (enableORM == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
<% } %>
<% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from '../repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository';
<% } %>

export class Create<%= h.changeCase.pascalCase(moduleName)%>Command implements ICommand {
  constructor(
    public readonly args: {
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= entityAttributes[i]%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
    }
  ) {}
}

@CommandHandler(Create<%= h.changeCase.pascalCase(moduleName)%>Command)
export class Create<%= h.changeCase.pascalCase(moduleName)%>CommandHandler
  implements ICommandHandler<Create<%= h.changeCase.pascalCase(moduleName)%>Command>
{
  private readonly logger = new Logger(Create<%= h.changeCase.pascalCase(moduleName)%>Command.name);

  constructor(
    <% if (enableORM == 'yes') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
    <% } %>
    <% if (enableORM == 'no') { %>
    private readonly repository: <%= h.changeCase.pascalCase(moduleName)%>Repository, 
    <% } %>
  ) {}

  execute = async (command: Create<%= h.changeCase.pascalCase(moduleName)%>Command): Promise<any> => {
    const insertResult = await this.repository.create(command.args);
    <% if (enableORM == 'yes') { %>
    const idCreated = insertResult.identifiers[0].<%= idField[0]%>; 
    <% } %>
    <% if (enableORM == 'no') { %>
     const idCreated = insertResult.rows[0].<%= idField[0]%>;
    <% } %>
    return Promise.resolve(new <%= h.changeCase.pascalCase(moduleName)%>Model({<%= idField[0]%>:idCreated}).getCreatedResponse);
  };
}
<% } %>
