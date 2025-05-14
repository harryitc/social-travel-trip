 
import { Injectable } from '@nestjs/common';
import { CustomQueryBuilder } from '@common/helpers/pg-query-builder';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { ISortingData, ILimitOffset } from '@common/helpers';

@Injectable()
export class MdienDanRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
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
      FROM posts
      WHERE TRUE = TRUE
    `;

    const { 
      searchString,
       info,  time_create,  time_update, 
     } = args.filters;
    const params = new Array<string>();
    // #Region additional filter ....
    // #EndRegion additional filter ....

    // #Region Filter:
    if (searchString && searchString?.length !== 0) {
      queryString += ` AND `;
      
        queryString += ` content ilike $${params.length + 1}  `;
      // Bạn có thẻ dùng slugify nếu search không dấu
        // params.push(`%${slugify(content ?? '', ' ')}%`);
        params.push(`%${searchString}%`);
      
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
      SELECT COUNT(user_id)
      FROM posts
      WHERE TRUE = TRUE
    `;
  
    const { 
      searchString,
       info,  time_create,  time_update, 
     } = args.filters;
    const params = new Array<string>();
    // #Region additional filter ....
    // #EndRegion additional filter ....

    // #Region Filter:
    if (searchString && searchString?.length !== 0) {
      queryString += ` AND `;
      
        queryString += ` content ilike $${params.length + 1}  `;
        // Bạn có thẻ dùng slugify nếu search không dấu
        // params.push(`%${slugify(content ?? '', ' ')}%`);
        params.push(`%${searchString}%`);
      
    }
    // #EndRegion Filter:
    return this.client.execute(queryString, params);
  }

  
  create = (args: {
    
      info: any;
    
      time_create: Date;
    
      time_update: Date;
    
  }) => {
    const query = `
      INSERT INTO posts (
      
        info,
        time_create,
        time_update
      )
      VALUES (
        $1,
        $2,
        $3)
      RETURNING *;
    `;
    return this.client.execute(query, [
       
        args.info,
        args.time_create,
        args.time_update
      ]);
  }
  

  findOne = (user_id: number) => {
    const query = `
      SELECT 
        user_id,
        
        info,
        time_create,
        time_update
      FROM posts
      WHERE user_id = $1
      LIMIT 1;
    `;
    return this.client.execute(query, [user_id]);
  };
  
     
  delete = (user_id: number) =>  {
    const query = `
      DELETE FROM posts
      WHERE user_id = $1;
    `;
    return this.client.execute(query, [user_id]);
  }
  

     
  deleteManyByIds = (ids: Array<number>) => {
    const query = `
      DELETE FROM posts
      WHERE user_id IN (${ids.map((_, index) => `$${index + 1}`).join(', ')})
      RETURNING *;
    `;
    return this.client.execute(query, ids);
  }
  

  
  // DOCS: https://aaronbos.dev/posts/update-json-postgresql 
  update = (args: {
    user_id: number;
    
      info: any;
      time_create: Date;
      time_update: Date;
  }) => {
    const query = `
      UPDATE posts SET 
      
        info= $1,
      
        time_create= $2,
      
        time_update= $3
       
      WHERE user_id = $4
    `;
    return this.client.execute(query, [
      
        args.info,
        args.time_create,
        args.time_update,
      args.user_id
    ]);
  }
  

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
          UPDATE posts
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
        `INSERT INTO posts(info, current_status, key, public_time) 
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

