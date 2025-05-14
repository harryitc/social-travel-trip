---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/queries/index.ts
---
import { Filter<%= h.changeCase.pascalCase(moduleName)%>QueryHandler } from './filter-<%= h.changeCase.kebabCase(moduleName)%>.query';
import { FindOne<%= h.changeCase.pascalCase(moduleName)%>QueryHandler } from './find-one-<%= h.changeCase.kebabCase(moduleName)%>.query';

export const QueryHandlers = [
  Filter<%= h.changeCase.pascalCase(moduleName)%>QueryHandler,
  FindOne<%= h.changeCase.pascalCase(moduleName)%>QueryHandler,
];

