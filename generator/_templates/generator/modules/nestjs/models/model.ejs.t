---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/models/<%= h.changeCase.kebabCase(moduleName)%>.model.ts
---
import { Create<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/create-<%= h.changeCase.kebabCase(moduleName)%>.dto';
import { Update<%= h.changeCase.pascalCase(moduleName)%>DTO } from '../dto/update-<%= h.changeCase.kebabCase(moduleName)%>.dto';

/**
  Luồng xử lý dữ liệu được nhận từ controller 
  Service sẽ gọi các phương thức để thu thập dữ liệu từ controller, proxy, query,… 
  Sau đó dữ liệu sẽ được đưa vào model bằng các hàm setter, sau đó gọi hàm getter để lấy dữ liệu đã tổng hợp được 
  Service gọi command lưu trử lại
*/
export class <%= h.changeCase.pascalCase(moduleName)%>Model {
  // #resion contructor
  private <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>;
  <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
  private <%= entityAttributes[i]%>!: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>

  constructor(args?: any) {
    const {
    <%= idField[0]%>,
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %><%= entityAttributes[i]%>,<% } %>
    } = args || {};
    this.<%= idField[0]%>= <%= idField[0]%>; 
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    this.<%= entityAttributes[i]%> = <%= entityAttributes[i]%>;<% } %>
  }
  set<%= h.changeCase.pascalCase(idField[0])%>(<%= idField[0]%>:<%= h.toTSDatatype(idField[1])%>):void {
    this.<%= idField[0]%>= <%= idField[0]%>;
  }
  get<%= h.changeCase.pascalCase(idField[0])%>() {
    return this.<%= idField[0]%>;
  }
  <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
  set<%= h.changeCase.pascalCase(entityAttributes[i])%>(<%= entityAttributes[i]%>:<%= h.toTSDatatype(entityAttributes[i+1])%>): void {
    this.<%= entityAttributes[i] %> = <%= entityAttributes[i]%>;
  } <% } %>
  <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
  get<%= h.changeCase.pascalCase(entityAttributes[i])%>() {
    return this.<%= entityAttributes[i]%>;
  } <% } %>
  // #endregion contructor

  // #region Bussiness LOGIC
  // Add your bussiness logic in this region
  // if your bussiness logic have any error please `throw LogicErrorException(`Your message`)`
  create(dto: Create<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    this.set<%= h.changeCase.pascalCase(entityAttributes[i])%>(dto.<%= entityAttributes[i]%>);<% } %>
  };

  getModelCreated() {
    return {
     <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
       <%= entityAttributes[i] %>: this.get<%= h.changeCase.pascalCase(entityAttributes[i])%>(),<% } %>
    }
  }

  update(dto: Update<%= h.changeCase.pascalCase(moduleName)%>DTO) {
    this.set<%= h.changeCase.pascalCase(idField[0])%>(dto.<%= idField[0]%>);
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    this.set<%= h.changeCase.pascalCase(entityAttributes[i])%>(dto.<%= entityAttributes[i]%>);<% } %>
  }
  getModelUpdated() {
    return {
      <%= idField[0]%>: this.get<%= h.changeCase.pascalCase(idField[0])%>(),
     <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
       <%= entityAttributes[i] %>: this.get<%= h.changeCase.pascalCase(entityAttributes[i])%>(),<% } %>
    }
  }

  // #endregion Bussiness LOGIC

  // #region format data
  // Format item return in list.
  get getItemInListResponse() {
    return {
      <%= idField[0]%>: this.get<%= h.changeCase.pascalCase(idField[0])%>(),
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
       <%= entityAttributes[i] %>:this.get<%= h.changeCase.pascalCase(entityAttributes[i])%>(),<% } %>
    };
  }

  get getOneResponse() {
    return {
      <%= idField[0]%>: this.get<%= h.changeCase.pascalCase(idField[0])%>(),
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
       <%= entityAttributes[i] %>: this.get<%= h.changeCase.pascalCase(entityAttributes[i])%>(),<% } %>
    };
  }

  get getCreatedResponse() {
    return {
      <%= idField[0]%>: this.get<%= h.changeCase.pascalCase(idField[0])%>(),
    }
  }

  get getUpdatedResponse () {
    return {
      <%= idField[0]%>: this.get<%= h.changeCase.pascalCase(idField[0])%>(),
    }
  }

  get getDeleteManyResponse() {
    return {
      <%= idField[0]%>: this.get<%= h.changeCase.pascalCase(idField[0])%>(),
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
       <%= entityAttributes[i] %>: this.get<%= h.changeCase.pascalCase(entityAttributes[i])%>(),<% } %>     
    }
  }
  // Add other logic to format response data
  // #endregion format data
}
