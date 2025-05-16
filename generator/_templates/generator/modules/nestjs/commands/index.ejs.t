---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/commands/index.ts
---
<% if (featureToGenerate.includes('Create_One')) { %>
import { Create<%= h.changeCase.pascalCase(moduleName)%>CommandHandler } from './create-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>
<% if (featureToGenerate.includes('Delete_By_Id')) { %>
import { Delele<%= h.changeCase.pascalCase(moduleName)%>CommandHandler } from './delete-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>
<% if (featureToGenerate.includes('Update_One')) { %>
import { Update<%= h.changeCase.pascalCase(moduleName)%>CommandHandler } from './update-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>
<% if (featureToGenerate.includes('Multi_Action_Delete')) { %>
import { DeleteMany<%= h.changeCase.pascalCase(moduleName)%>CommandHandler } from './delete-many-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>

export const CommandHandlers = [
   <% if (featureToGenerate.includes('Delete_By_Id')) { %>
  Delele<%= h.changeCase.pascalCase(moduleName)%>CommandHandler,
  <% } %>
  <% if (featureToGenerate.includes('Create_One')) { %>
  Create<%= h.changeCase.pascalCase(moduleName)%>CommandHandler,
  <% } %>
  <% if (featureToGenerate.includes('Update_One')) { %>
  Update<%= h.changeCase.pascalCase(moduleName)%>CommandHandler,
  <% } %>
  <% if (featureToGenerate.includes('Multi_Action_Delete')) { %>
   DeleteMany<%= h.changeCase.pascalCase(moduleName)%>CommandHandler,
  <% } %>
];
