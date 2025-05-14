---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/<%= moduleName %>.module.ts
---
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { <%= h.changeCase.pascalCase(moduleName)%>Controller } from './controllers/<%= h.changeCase.kebabCase(moduleName)%>.controller';
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from './services/<%= h.changeCase.kebabCase(moduleName)%>.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

<% if (generateAxios == 'yes') { %>
import { <%= h.changeCase.pascalCase(moduleName)%>Proxy } from './proxies/<%= h.changeCase.kebabCase(moduleName)%>.proxy';
import { AxiosHTTPModuleServiceA } from '@configs/axios-http/config.module';
<% } %>

<% if (enableORM == 'yes') { %>
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { <%= typeORMConnectionString %> } from '@configs/databases/typeorm/configuration';
import { <%= h.changeCase.pascalCase(moduleName)%>ORMRepository } from './repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository';
import { <%= h.changeCase.pascalCase(moduleName)%>Entity } from './orm-entities/<%= h.changeCase.kebabCase(moduleName)%>.entity';
<% } %>

<% if (enableORM == 'no') { %>
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { <%= pgsqlConnectionString %> } from '@configs/databases/postgresql/configuration';
import { Repositories } from './repositories';
<% } %>

@Module({
  imports: [
    CqrsModule,
    <% if (enableORM == 'no') { %>
    PostgresModule.forFeature(<%= pgsqlConnectionString %>),
    <% } %>
    <% if (enableORM == 'yes') { %>
    // Trường hợp có nhiều kết nối đến db -> Phải chỉ định thêm dataSource key
    TypeOrmModule.forFeature([<%= h.changeCase.pascalCase(moduleName)%>Entity],
      <%= typeORMConnectionString %>,
    ),<% } %>
    <% if (generateAxios == 'yes') { %>
    // Proxy nay se duoc dung trong Product proxy.
    AxiosHTTPModuleServiceA,
    <% } %>
  ],
  controllers: [<%= h.changeCase.pascalCase(moduleName)%>Controller],
  providers: [
    <%= h.changeCase.pascalCase(moduleName)%>Service,
    <% if (generateAxios == 'yes') { %>
    <%= h.changeCase.pascalCase(moduleName)%>Proxy,
    <% } %>
    ...QueryHandlers,
    ...CommandHandlers,
    <% if (enableORM == 'no') { %>
    ...Repositories,
    <% } %>
    <% if (enableORM == 'yes') { %>
    // Thêm provider cho repository khi sử dụng ORM
    {
      provide: <%= h.changeCase.pascalCase(moduleName)%>ORMRepository,
      useFactory: (datasource: DataSource) =>
        new <%= h.changeCase.pascalCase(moduleName)%>ORMRepository(datasource),
      inject: [
        getDataSourceToken(TYPE_ORM_DATASOURCE_INJECT_TOKEN_MAIN_DATABASE),
      ],
    },<% } %>
  ],
})
export class <%= h.changeCase.pascalCase(moduleName)%>Module {}