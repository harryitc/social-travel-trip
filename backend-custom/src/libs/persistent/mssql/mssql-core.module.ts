import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConnectionPoolMSSQL } from './connection-mssql';

export interface Connection {
  name?: string;
}

export interface AsyncConnection {
  imports?: any[];
  useFactory: (...params: any[]) => Connection[];
  inject?: any[];
}

export const MSSQL_MODULE_OPTIONS = Symbol('mssql-module-options');
export const CONNECTION_MSSQL_MAP_PROVIDER = Symbol(
  'connection-mssql-map-provider',
);

export const DEFAULT = 'default';

@Global()
@Module({})
export class MSSQLCoreModule {

  /**
   * tạo danh sách kết nối databse 
   */
  public static forRootAsync(options: AsyncConnection): DynamicModule {
    return {
      module: MSSQLCoreModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProvider(options)],
      exports: [...this.createAsyncProvider(options)],
    };
  }

  /**
   * xử lý danh sách kết nối db
   */
  private static createAsyncProvider(options: AsyncConnection) {
    return [
      // load kết nối tất cả databse khai báo
      {
        provide: MSSQL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      {
        // tiến hành map thành: key, kết nối sql
        // mục đích lưu sẵn kết nối sql xử lý, chờ gọi lấy đối tượng kết nối db để truy vấn tương ứng
        provide: CONNECTION_MSSQL_MAP_PROVIDER,
        useFactory: async (options: Connection[]) => {
          const CONNECTION_MSSQL_MAP = new Map<string, ConnectionPoolMSSQL>();
          for (const conn of options) {
            console.log(options)
            CONNECTION_MSSQL_MAP.set(
              conn.name || DEFAULT,
              new ConnectionPoolMSSQL(await ConnectionPoolMSSQL.createPool(conn)),
            );
          }

          return CONNECTION_MSSQL_MAP;
        },
        inject: [MSSQL_MODULE_OPTIONS],
      },
    ];
  }
}
