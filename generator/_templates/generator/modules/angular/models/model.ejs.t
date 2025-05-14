---
to: <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/models/<%= h.changeCase.kebabCase(moduleName)%>.model.ts
---
export class <%= h.changeCase.pascalCase(moduleName)%>Model {
  // #resion contructor
  <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>;
  <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
  <%= entityAttributes[i]%>!: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>

  constructor(args?: any) {
    const {
    <%= idField[0]%>,
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %><%= entityAttributes[i]%>,<% } %>
    } = args || {};
    this.<%= idField[0]%>= <%= idField[0]%>; 
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    this.<%= entityAttributes[i]%> = <%= entityAttributes[i]%>;<% } %>
  }
  // #endregion contructor

  // #region format data
    mapArray = (arr: any[]) => {
      return arr.map((element) => new <%= h.changeCase.pascalCase(moduleName)%>Model({
          <%= idField[0]%>: element.<%= idField[0]%>,
          <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
          <%= entityAttributes[i]%>: element.<%= entityAttributes[i]%>,<% } %>
      }));
    }
    // #endregion format data
    
  // #region Bussiness LOGIC
  mapDeleteManyByIdsResponse = (response: {
    success: boolean,
    affected: number,
    raws: Array<any>
  } | any, request: Array<any>) => {
    const successRecord: Array<any> = [];
    const errorRecord: Array<any> = [];

    if (response.success) {
      for (let index = 0; index < request.length; index++) {
        const element = request[index];
        if (
          response.raws.some((e: any) => e.category_id == element.category_id)
        ) {
          successRecord.push(element);
        } else {
          errorRecord.push(element);
        }
      }
    } else {
      errorRecord.push(...request);
    }
    return {
      successRecords: successRecord,
      errorRecords: errorRecord,
    };
  }
  // #endregion Bussiness LOGIC
}
