---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/dto/delete-<%= h.changeCase.kebabCase(moduleName)%>.dto.ts
---
<% if (featureToGenerate.includes('Delete_By_Id')) { %>   
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
    
export class Delete<%= h.changeCase.pascalCase(moduleName)%>DTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Example id <%= idField[1] %>' })
  <%= idField[0] %>?: <%= h.toTSDatatype(idField[1])%>;
}
<% } %>
