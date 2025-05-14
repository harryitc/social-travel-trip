---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/orm-entities/<%= h.changeCase.kebabCase(moduleName)%>.entity.ts
---
<% if (enableORM == 'yes') { %>
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Lớp để khai báo các cột trong bảng để orm map dữ liệu từ DB
 * Sau đó ta sẽ sữ dụng Repository của ORM cung cấp để truy vấn dữ liệu
 * Mỗi module sẽ có các orm-entities riêng.
 */
@Entity('<%= pgsqlDataTableName %>')
export class <%= h.changeCase.pascalCase(moduleName)%>Entity {
  @PrimaryGeneratedColumn()
  <%= idField[0]%>?: <%= h.toTSDatatype(idField[1])%>;

  <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
  @Column({ type: '<%= entityAttributes[i+1] %>', nullable: true })
  <%= entityAttributes[i] %>?: <%= h.toTSDatatype(entityAttributes[i+1])%>;
  <% } %>
}
<% } %>