---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/controllers/<%= h.changeCase.kebabCase(moduleName)%>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  HttpCode,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Filter<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/filter-<%= h.changeCase.kebabCase(moduleName)%>.dto';
<% if (featureToGenerate.includes('Create_One')) { %>
import { Create<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/create-<%= h.changeCase.kebabCase(moduleName)%>.dto';
<% } %>
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from '../services/<%= h.changeCase.kebabCase(moduleName)%>.service';
<% if (featureToGenerate.includes('Update_One')) { %>
import { Update<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/update-<%= h.changeCase.kebabCase(moduleName)%>.dto';
<% } %>
<% if (featureToGenerate.includes('Delete_By_Id')) { %>   
import { Delete<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/delete-<%= h.changeCase.kebabCase(moduleName)%>.dto';
<% } %>
<% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
import { Delete<%= h.changeCase.pascalCase(moduleName)%>ManyDTO } from '../dto/delete-many-<%= h.changeCase.kebabCase(moduleName)%>.dto';
<% } %>
@ApiTags('API <%= h.changeCase.pascalCase(moduleName)%>')
@Controller('<%= h.changeCase.kebabCase(moduleName)%>')
export class <%= h.changeCase.pascalCase(moduleName)%>Controller {
  constructor(private readonly service: <%= h.changeCase.pascalCase(moduleName)%>Service) {}

  @Post('query')
  @ApiOperation({
    summary: `Query: paging, sorting, searching, filtering`,
    description: '',
  })
  @HttpCode(200)
  getByFilterPost(
    @Body() filterDTO: Filter<%= h.changeCase.pascalCase(moduleName)%>DTO,
    @Request() req: any,
  ) {
    const requestUID = req['user']?.id ?? 'test';
    return this.service.filter(filterDTO, requestUID);
  }
  
  <% if (featureToGenerate.includes('Fullscreen_Detail') || featureToGenerate.includes('Quick_View')) { %>
  @Get('find-one')
  @ApiOperation({
    summary: `Get one by <%= idField[0]%>`,
    description: '',
  })
  @HttpCode(200)
  findOne(@Query('<%= idField[0]%>') <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) {
    return this.service.findOne(<%= idField[0]%>);
  }
  <% } %>

  <% if (featureToGenerate.includes('Create_One')) { %>
  @Post('create')
  @HttpCode(201)
  @ApiOperation({
    summary: ``,
    description: '',
  })
  create(@Body() dto: Create<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    return this.service.create(dto);
  }
  <% } %>

  <% if (featureToGenerate.includes('Update_One')) { %>
  @Put('update-one')
  @ApiOperation({
    summary: ``,
    description: '',
  })
  updateOne(@Body() dto: Update<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    return this.service.update(dto);
  }
  <% } %>

  <% if (featureToGenerate.includes('Delete_By_Id')) { %> 
  @Delete('delete')
  @ApiOperation({
    summary: `Delete one by <%= idField[0]%>`,
    description: '',
  })
  delete(@Query() dto: Delete<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    return this.service.delete(dto);
  }
  <% } %>

  <% if (featureToGenerate.includes('Multi_Action_Delete')) { %> 
  @Post('delete-many-by-ids')
  @HttpCode(200)
  @ApiOperation({
    summary: `Delete many by <%= idField[0]%>`,
    description: '',
  })
  deleteManyByIds(@Body() dto: Delete<%= h.changeCase.pascalCase(moduleName)%>ManyDTO) {
    return this.service.deleteManyByIds(dto);
  }
  <% } %>



  /**
  @Post('create-product-and-variant')
  @ApiOperation({
    summary: ``,
    description: '',
  })
  createProductAndVariatn(@Body() dto: Create<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    return this.service.createProductAndDefaultVariant(dto);
  }

  @Put('update-many')
  @ApiOperation({
    summary: ``,
    description: '',
  }) 
  updateManyProduct(@Body() dto: UpdateManyArray) {
    return this.service.updateManyById(dto);
  }
  */
}
