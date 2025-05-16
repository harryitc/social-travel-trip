---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/migrations/Version-1.0.0.ts
---

module.exports = async (client, schema) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${schema}.<%=pgsqlDataTableName%> (
    <%= idField[0] %>  <%= h.changeCase.upper(idField[1]) %> PRIMARY KEY,
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    <%= entityAttributes[i] %>  <%=  entityAttributes[i+1] %><% if (i < entityAttributes.length - 2) { %>,<% } %><% } %>
    );
  `;
  await client.query(createTableQuery);
 /// Additional query for this version.
};
