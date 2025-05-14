---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/dto/update-<%= h.changeCase.kebabCase(moduleName)%>.dto.ts
---
<% if (featureToGenerate.includes('Update_One')) { %>  
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class Update<%= h.changeCase.pascalCase(moduleName)%>DTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example id <%= idField[1] %>' })
  <%= idField[0] %>?: <%= h.toTSDatatype(idField[1])%>;

  <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
  @IsNotEmpty()
  @ApiProperty({ example: 'Example data <%= entityAttributes[i+1] %>' })
  <%= entityAttributes[i] %>?: <%= h.toTSDatatype(entityAttributes[i+1])%>;
  <% } %>  
}
 <% } %>