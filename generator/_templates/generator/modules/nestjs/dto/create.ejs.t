---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/dto/create-<%= h.changeCase.kebabCase(moduleName)%>.dto.ts
---
<% if (featureToGenerate.includes('Create_One')) { %>

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Create<%= h.changeCase.pascalCase(moduleName)%>DTO {
  <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
  @IsNotEmpty()
  @ApiProperty({ example: 'Example data <%= entityAttributes[i+1] %>' })
  <%= entityAttributes[i] %>?: <%= h.toTSDatatype(entityAttributes[i+1])%>;
  <% } %>  
}
<% } %>
