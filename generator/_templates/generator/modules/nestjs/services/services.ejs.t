---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/services/<%= h.changeCase.kebabCase(moduleName)%>.service.ts
---
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
<% if (featureToGenerate.includes('Delete_By_Id')) { %>
import { Delete<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/delete-<%= h.changeCase.kebabCase(moduleName)%>.dto';
import { Delele<%= h.changeCase.pascalCase(moduleName)%>Command } from '../commands/delete-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>
<% if (featureToGenerate.includes('Create_One')) { %>
import { Create<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/create-<%= h.changeCase.kebabCase(moduleName)%>.dto';
import { Create<%= h.changeCase.pascalCase(moduleName)%>Command } from '../commands/create-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>
<% if (featureToGenerate.includes('Update_One')) { %>
import { Update<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/update-<%= h.changeCase.kebabCase(moduleName)%>.dto';
import { Update<%= h.changeCase.pascalCase(moduleName)%>Command } from '../commands/update-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>
<% if (featureToGenerate.includes('Fullscreen_Detail') || featureToGenerate.includes('Quick_View')) { %>
import { FindOne<%= h.changeCase.pascalCase(moduleName)%>Query } from '../queries/find-one-<%= h.changeCase.kebabCase(moduleName)%>.query';
<% } %>

<% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
import { Delete<%= h.changeCase.pascalCase(moduleName)%>ManyDTO } from '../dto/delete-many-<%= h.changeCase.kebabCase(moduleName)%>.dto';
import { DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command } from '../commands/delete-many-<%= h.changeCase.kebabCase(moduleName)%>.command';
<% } %>

import { Filter<%= h.changeCase.pascalCase(moduleName)%>Query } from '../queries/filter-<%= h.changeCase.kebabCase(moduleName)%>.query';
import { Filter<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/filter-<%= h.changeCase.kebabCase(moduleName)%>.dto';

import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
<% if (generateAxios == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Proxy } from '../proxies/<%= h.changeCase.kebabCase(moduleName)%>.proxy';
<% } %>
@Injectable()
export class <%= h.changeCase.pascalCase(moduleName)%>Service {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    <% if (generateAxios == 'yes') { %>
    private readonly proxy: <%= h.changeCase.pascalCase(moduleName)%>Proxy,
    <% } %>
  ) {}

  /**
    You can call proxy to get nescesarry data then set data to model.
    const data = await this.proxy.findAll();
  */ 

  filter(dto: Filter<%= h.changeCase.pascalCase(moduleName)%>DTO, userId: string) {
    // You can update your code to query by userId, if it's not nescessarry please remove it.
    return this.queryBus.execute(new Filter<%= h.changeCase.pascalCase(moduleName)%>Query(dto));
  }

  <% if (featureToGenerate.includes('Fullscreen_Detail') || featureToGenerate.includes('Quick_View')) { %>
  findOne(<%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) {
    return this.queryBus.execute(new FindOne<%= h.changeCase.pascalCase(moduleName)%>Query(<%= idField[0]%>));
  }
  <% } %>
  
  <% if (featureToGenerate.includes('Create_One')) { %>
  create(dto: Create<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    const model = new <%= h.changeCase.pascalCase(moduleName)%>Model();
    model.create(dto);
    return this.commandBus.execute(
      new Create<%= h.changeCase.pascalCase(moduleName)%>Command(model.getModelCreated()),
    );
  }
  <% } %>
  <% if (featureToGenerate.includes('Update_One')) { %>
  update(dto: Update<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    const model = new <%= h.changeCase.pascalCase(moduleName)%>Model();
    model.update(dto);
    return this.commandBus.execute(
      new Update<%= h.changeCase.pascalCase(moduleName)%>Command(model.getModelUpdated()),
    );
  }
  <% } %>
  <% if (featureToGenerate.includes('Delete_By_Id')) { %>
  delete(dto:Delete<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    return this.commandBus.execute(new Delele<%= h.changeCase.pascalCase(moduleName)%>Command(dto.<%= idField[0]%>));
  }
  <% } %>

  <% if (featureToGenerate.includes('Multi_Action_Delete')) { %> 
  deleteManyByIds(dto: Delete<%= h.changeCase.pascalCase(moduleName)%>ManyDTO) {
    return this.commandBus.execute(new DeleteMany<%= h.changeCase.pascalCase(moduleName)%>Command(dto.arrayIds));
  }
  <% } %>

  /**  
  updateManyById(dto: UpdateManyArray) {
    const updateInfo = dto.info.map((element) => {
      const model = new <%= h.changeCase.pascalCase(moduleName)%>Model();
      model.updateDescAndImage(element);
      return model.getUpdateDescAndImage();
    });
    return this.commandBus.execute(new UpdateManyCommand(updateInfo));
  }
  */
  // Tao san pham voi bien the mac dinh
  /**  
  createProductAndDefaultVariant(dto: Create<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    const model = new <%= h.changeCase.pascalCase(moduleName)%>Model();
    model.createByName(dto.name_default);
    const saveInfo = model.getCreatedByName();

    return this.commandBus.execute(
      new CreateProductAndDefaultVariantCommand(saveInfo, saveInfo),
    );
  }
  */

}
