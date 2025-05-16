import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionPoolMSSQL } from './connection-mssql';
import {
  AsyncConnection,
  CONNECTION_MSSQL_MAP_PROVIDER,
  DEFAULT,
  MSSQLCoreModule,
} from './mssql-core.module';

export function generateConnectionMSSQLToken(name: string) {
  return `CONNECTION_MSSQL_${name.toUpperCase()}`;
}

@Module({})
export class MSSQLModule {
  /**
   * tạo sẵn danh sách key inject kết nối database cần dùng
   */
  public static forRootAsync(options: AsyncConnection): DynamicModule {
    return {
      module: MSSQLModule,
      imports: [MSSQLCoreModule.forRootAsync(options)],
    };
  }

  /**
   * lấy kết nối thông qua tên db sql
   */
  public static forFeature(connection: string = DEFAULT): DynamicModule {
    return {
      module: MSSQLModule,
      providers: [this.createConnectionPoolProvider(connection)],
      exports: [this.createConnectionPoolProvider(connection)],
    };
  }

  /**
   * get thông tin kết nối db thông qua token DI
   */
  private static createConnectionPoolProvider(connection: string) {
    return {
      provide: generateConnectionMSSQLToken(connection),
      useFactory: (connPoolMap: Map<string, ConnectionPoolMSSQL>) => {
        if (!connPoolMap.has(connection)) {
          throw new Error(`no MSSQL connection ${connection} available`);
        }

        return connPoolMap.get(connection);
      },
      inject: [CONNECTION_MSSQL_MAP_PROVIDER],
    };
  }
}
