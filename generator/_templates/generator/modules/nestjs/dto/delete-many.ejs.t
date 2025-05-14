---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/dto/delete-many-<%= h.changeCase.kebabCase(moduleName)%>.dto.ts
---
<% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
    
export class Delete<%= h.changeCase.pascalCase(moduleName)%>ManyDTO {
  @IsNotEmpty()
  @ApiProperty({ example: [1,2,3] })
  @IsArray()
  arrayIds?: Array<<%= h.toTSDatatype(idField[1])%>>;
}
<% } %>
