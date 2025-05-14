---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/repositories/<%= h.changeCase.kebabCase(moduleName)%>.orm.repository.ts
---
<% if (enableORM == 'yes') { %>
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { <%= h.changeCase.pascalCase(moduleName)%>Entity } from '../orm-entities/<%= h.changeCase.kebabCase(moduleName)%>.entity';
import { ISortingData, ILimitOffset, CustomQueryHelper } from '@common/helpers';
import { <%= typeORMConnectionString %> } from '@configs/databases/typeorm/configuration';
import _ from 'lodash';

/**
 * Repository dùng TypeORM
 * Chứa các logic truy vấn dữ liệu của ORM
 * Docs: https://docs.nestjs.com/techniques/database
 */
@Injectable()
export class <%= h.changeCase.pascalCase(moduleName)%>ORMRepository {
  constructor(
    @InjectDataSource(<%= typeORMConnectionString %>)
    private dataSource: DataSource,
  ) {}

  /**
   * DOCs: https://orkhan.gitbook.io/typeorm/docs/select-query-builder
   * Truy vấn lấy danh sách - gồm các logic sắp xếp, lọc, phân trang và logic bổ xung
   * Dấu `:` trước variable nameDefaultSearchString có cách hoạt động tương tự như `$`
   *  -> Dùng query params để tránh SQL Injection
   *  */
   getManyByFilter = async (args: {
    filters: object;
    sorts: ISortingData;
    pageSize: ILimitOffset;
  }) => {
    const { searchString, status } = args.filters as any;

    const queryBuidler = this.dataSource
      .getRepository(<%= h.changeCase.pascalCase(moduleName)%>Entity)
      .createQueryBuilder('entityQB');

    // #Region additional filter ....
    // #EndRegion additional filter ....

    // #Region Filter:
    if (searchString && searchString?.length !== 0) {
      let queryString = '';
      <% for(var i=0; i < searchFields.length; i++) { %>
        queryString += ` <%= searchFields[i]%> ilike :search  <% if (i < searchFields.length - 1) { %> OR <% } %> `;
      <% } %>

      queryBuidler.andWhere(queryString,
        {
          search: `%${searchString}%`,
          // Bạn có thẻ dùng slugify nếu search không dấu
          // search: `%${slugify(searchString ?? '', ' ')}%`,
        },
      );
    }
    // #EndRegions Filter:

    // #regions Order and limit
    if (!_.isEmpty(args.sorts)) {
      queryBuidler.orderBy(args.sorts);
    }
    queryBuidler.limit(args.pageSize.limit).offset(args.pageSize.offset);
    // #endregions Order and limit

    const result = CustomQueryHelper.toQueryAndCountResult(
      await queryBuidler.getManyAndCount(),
    );
    return result;
  }

  findOne = (<%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) => {
    return this.dataSource
      .createQueryBuilder(<%= h.changeCase.pascalCase(moduleName)%>Entity, "entityQB")
      .where('entityQB.<%= idField[0]%> = :id', {
        id: <%= idField[0]%>,
      })
      .execute();
  }

  <% if (featureToGenerate.includes('Delete_By_Id')) { %>   
  delete = (<%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>) => {
    return this.dataSource.manager.delete(<%= h.changeCase.pascalCase(moduleName)%>Entity, <%= idField[0]%>);
  }
  <% } %>

  <% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
  deleteManyByIds = (ids: Array<<%=  h.toTSDatatype(idField[1]) %>>) => {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(<%= h.changeCase.pascalCase(moduleName)%>Entity)
      .where('<%= idField[0]%> IN (:...ids)', { ids })
      .execute();
  }
  <% } %>

  <% if (featureToGenerate.includes('Update_One')) { %>
  update = (args: { 
    <%= idField[0]%>: <%=  h.toTSDatatype(idField[1]) %>;
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= entityAttributes[i]%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
   }) => {

    const updateInfo = {
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= entityAttributes[i]%>: args.<%= entityAttributes[i]%>,
      <% } %>
    };

    return this.dataSource
      .createQueryBuilder()
      .update(<%= h.changeCase.pascalCase(moduleName)%>Entity)
      .set(updateInfo)
      .where('<%= idField[0]%> = :id', {
        id: args.<%= idField[0]%>,
      })
      .execute();
  }
  <% } %>
  
  <% if (featureToGenerate.includes('Create_One')) { %>
  create = (args: {
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= entityAttributes[i]%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
  }) => {
    const entity: <%= h.changeCase.pascalCase(moduleName)%>Entity = {
       <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= entityAttributes[i]%>: args.<%= entityAttributes[i]%>,
      <% } %>
    };
    return this.dataSource.manager.insert(<%= h.changeCase.pascalCase(moduleName)%>Entity, entity);
  }
  <% } %>

  /**
  // Update many transaction ORM:
  updateManyTransaction(data: Array<any>) {
    const productEntities = data.map((element) => {
      const entity = new <%= h.changeCase.pascalCase(moduleName)%>Entity();
      entity.info = element.info;
      entity.id = element.id;
      return entity;
    });

    return this.dataSource.transaction(
      'SERIALIZABLE',
      async (entityManager) => {
        for (const product of productEntities) {
          await entityManager
            .createQueryBuilder()
            .update(<%= h.changeCase.pascalCase(moduleName)%>Entity)
            .set({
              info: () =>
                `info || '{
                "images": {
                  "anh_dai_dien": ${JSON.stringify(product.info.images.anh_dai_dien)}
                },
                "description": ${JSON.stringify(product.info.description)}
              }'
              ::jsonb`,
            })
            .where('id = :id', {
              id: product.id,
            })
            .execute();
        }
      },
    );
  }

  // Transaction in many table: insert product then insert variant
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
    // const CategoryEntity: CategoryEntity = {
    //   info: product.info,
    //   current_status: product.currentStatus,
    //   key: product.key,
    //   public_time: product.publicTime,
    // };

    // const variantEntity: any = {
    //   info: variant.info,
    //   currentStatus: variant.currentStatus,
    //   publicTime: variant.publicTime,
    //   isDefault: variant.isDefault,
    // };

    // return this.dataSource.transaction(
    //   'SERIALIZABLE',
    //   async (entityManager) => {
    //     const saveResult = await entityManager.save(
    //       CategoryEntity,
    //       CategoryEntity,
    //     );

    //     variantEntity.productId = saveResult.id;

    //     // await entityManager.save(ProductVariantEntity, variantEntity);
    //   },
    // );
    return Promise.resolve({ product, variant });
  }
  */
}

 <% } %>