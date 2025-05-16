---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/repositories/<%= h.changeCase.kebabCase(moduleName)%>.repository.ts
---
 <% if (enableORM == 'no') { %>
import { Injectable } from '@nestjs/common';
import { CustomQueryBuilder } from '@common/helpers/pg-query-builder';
import { <%= pgsqlConnectionString %> } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { ISortingData, ILimitOffset } from '@common/helpers';

@Injectable()
export class <%= h.changeCase.pascalCase(moduleName)%>Repository {
  constructor(
    @PgSQLConnection(<%= pgsqlConnectionString %>)
    private readonly client: PgSQLConnectionPool,
  ) {}

  /**
   * Truy vấn lấy danh sách - gồm các logic sắp xếp, lọc, phân trang và logic bổ xung
   * */
  getManyByFilter = (args: {
    filters: any;
    sorts: ISortingData;
    pageSize: ILimitOffset;
  }) => {
    let queryString = `
      SELECT *
      FROM <%= pgsqlDataTableName %>
      WHERE TRUE = TRUE
    `;

    const { 
      searchString,
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %> <%= entityAttributes[i]%>, <% } %>
     } = args.filters;
    const params = new Array<string>();
    // #Region additional filter ....
    // #EndRegion additional filter ....

    // #Region Filter:
    if (searchString && searchString?.length !== 0) {
      queryString += ` AND `;
      <% for(var i=0; i < searchFields.length; i++) { %>
        queryString += ` <%= searchFields[i]%> ilike $${params.length + 1}  <% if (i < searchFields.length - 1) { %> OR <% } %>`;
      // Bạn có thẻ dùng slugify nếu search không dấu
        // params.push(`%${slugify(<%= searchFields[i]%> ?? '', ' ')}%`);
        params.push(`%${searchString}%`);
      <% } %>
    }
    // #EndRegions Filter:

    // #regions Order and limit
    queryString += CustomQueryBuilder.toOrder(args.sorts); // ORDER BY FIELDS DESC/ASC
    queryString += CustomQueryBuilder.toLimitOffset(args.pageSize); // LIMIT 4 OFFSET 5
    // #endregions Order and limit

    return this.client.execute(queryString, params);
  };

  countByFilter = (args: {
    filters: any;
    sorts: any;
    pageSize: any;
  }) => {
    let queryString = `
      SELECT COUNT(<%= idField[0]%>)
      FROM <%= pgsqlDataTableName %>
      WHERE TRUE = TRUE
    `;
  
    const { 
      searchString,
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %> <%= entityAttributes[i]%>, <% } %>
     } = args.filters;
    const params = new Array<string>();
    // #Region additional filter ....
    // #EndRegion additional filter ....

    // #Region Filter:
    if (searchString && searchString?.length !== 0) {
      queryString += ` AND `;
      <% for(var i=0; i < searchFields.length; i++) { %>
        queryString += ` <%= searchFields[i]%> ilike $${params.length + 1}  <% if (i < searchFields.length - 1) { %> OR <% } %>`;
        // Bạn có thẻ dùng slugify nếu search không dấu
        // params.push(`%${slugify(<%= searchFields[i]%> ?? '', ' ')}%`);
        params.push(`%${searchString}%`);
      <% } %>
    }
    // #EndRegion Filter:
    return this.client.execute(queryString, params);
  }

  <% if (featureToGenerate.includes('Create_One')) { %>
  create = (args: {
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= entityAttributes[i]%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;
    <% } %>
  }) => {
    const query = `
      INSERT INTO <%= pgsqlDataTableName %> (
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= entityAttributes[i]%><% if (i < entityAttributes.length - 2) { %>,<% } %><% } %>
      )
      VALUES (<% for(var i=1; i <= entityAttributes.length/2; i++) { %>
        $<%=i%><% if (i < entityAttributes.length/2) { %>,<% } %><% } %>)
      RETURNING *;
    `;
    return this.client.execute(query, [
       <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        args.<%= entityAttributes[i]%><% if (i < entityAttributes.length - 2) { %>,<% } %><% } %>
      ]);
  }
  <% } %>

  findOne = (<%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) => {
    const query = `
      SELECT 
        <%= idField[0]%>,
        <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= entityAttributes[i]%><% if (i < entityAttributes.length - 2) { %>,<% } %><% } %>
      FROM <%= pgsqlDataTableName %>
      WHERE <%= idField[0]%> = $1
      LIMIT 1;
    `;
    return this.client.execute(query, [<%= idField[0]%>]);
  };
  
  <% if (featureToGenerate.includes('Delete_By_Id')) { %>   
  delete = (<%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) =>  {
    const query = `
      DELETE FROM <%= pgsqlDataTableName %>
      WHERE <%= idField[0]%> = $1;
    `;
    return this.client.execute(query, [<%= idField[0]%>]);
  }
  <% } %>

  <% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
  deleteManyByIds = (ids: Array<<%=  h.toTSDatatype(idField[1]) %>>) => {
    const query = `
      DELETE FROM <%= pgsqlDataTableName %>
      WHERE <%= idField[0]%> IN (${ids.map((_, index) => `$${index + 1}`).join(', ')})
      RETURNING *;
    `;
    return this.client.execute(query, ids);
  }
  <% } %>

  <% if (featureToGenerate.includes('Update_One')) { %>
  // DOCS: https://aaronbos.dev/posts/update-json-postgresql 
  update = (args: {
    <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>;
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= entityAttributes[i]%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
  }) => {
    const query = `
      UPDATE <%= pgsqlDataTableName %> SET 
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= entityAttributes[i]%>= $<%= (i/2)+1 %><% if (i < entityAttributes.length - 2) { %>,<% } %>
      <% } %> 
      WHERE <%= idField[0]%> = $<%=(entityAttributes.length / 2) + 1 %>
    `;
    return this.client.execute(query, [
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        args.<%= entityAttributes[i]%>,<% } %>
      args.<%= idField[0]%>
    ]);
  }
  <% } %>

  /** 
    Trường họp transaction update nhiều dòng tên 1 bảng, 
    hoặc có thể dùng pg-format để insert nhiều dòng trong 1 bảng cho 1 lần query (khong dung transaction)
    Ví dụ về postgres format để insert nhiều dòng dữ liệu cho 1 lần query:
    ...
    updateManyTransaction(data: Array<any>) {
      // Logic map your data to nested array.
      const myNestedArray = [['a', 1], ['b', 2]];
      const queryString = format('INSERT INTO tableName (name, age) VALUES %L', myNestedArray); 
      reutrn this.client.query(queryString);
    }
  */
  /**
  updateManyTransaction(data: Array<any>) {
    return this.client.transaction(async (client: PoolClient) => {
      for (const item of data) {
        await client.query(`
          UPDATE <%= pgsqlDataTableName %>
          SET info = info || jsonb_set(
              jsonb_set(info, $1, $2, true),
              $3, $4, true
            )
          WHERE id = $5
            `,
          [
            ['images', 'anh_dai_dien'], // $1
            JSON.stringify(item.info.images.anh_dai_dien), // $2
            '{description}', // $3
            JSON.stringify(item.info.description),
            item.id,
          ],
        );
      }
    });
  }

  /**
    Trường họp transaction update dữ liệu trên 2 hay nhiều bảng
  */  
  /**
  insertProductAndDefaultVariant(
    product: {
      info: any;
      currentStatus: any;
      key: any;
      publicTime: any;
    },
    variant: {
      info: any;
      currentStatus: any;
      isDefault: any;
      publicTime: any;
    },
  ) {
    return this.client.transaction(async (client: PoolClient) => {
      // About transaction iso: https://www.postgresql.org/docs/current/transaction-iso.html
      await client.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`);

      // Execute your query ...
      const productResult = await client.query(
        `INSERT INTO <%= pgsqlDataTableName %>(info, current_status, key, public_time) 
         VALUES($1, $2, $3, $4) RETURNING *`,
        [product.info, product.currentStatus, product.key, product.publicTime],
      );

      const productId = productResult.rows[0].id;

      // Insert default variant
      await client.query(
        `INSERT INTO ec_variants(info, current_status, is_default, public_time, id) 
         VALUES($1, $2, $3, $4, $5)`,
        [
          variant.info,
          variant.currentStatus,
          variant.isDefault,
          variant.publicTime,
          productId,
        ],
      );
    });
  }
  */
}

<% } %>