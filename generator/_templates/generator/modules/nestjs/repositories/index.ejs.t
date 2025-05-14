---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/repositories/index.ts
---
 <% if (enableORM == 'no') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Repository } from './<%= h.changeCase.kebabCase(moduleName)%>.repository';

export const Repositories = [<%= h.changeCase.pascalCase(moduleName)%>Repository];
<% } %>
