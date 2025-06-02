import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import {
  MssqlAnhQuanConfig,
  MSSQL_ANH_QUAN,
} from './configuration';
import { MSSQLModule } from '@libs/persistent/mssql/mssql.module';

/**
 * Module này sẽ chứa tất cả các kết nối đến cơ sở dữ liệu posgresql
 * Chỉ được import 1 lần tại AppModule.
 * Các module tính năng khi import chỉ cần import: [PostgresModule.forFeature(CONNECTION)]
 */
@Module({
  imports: [
    MSSQLModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(MssqlAnhQuanConfig),
      ],
      useFactory: (
        dbAnhQuanConfig: ConfigType<typeof MssqlAnhQuanConfig>,
      ) => {
        return [
          {
            name: MSSQL_ANH_QUAN,
            database: dbAnhQuanConfig.database,
            host: dbAnhQuanConfig.host,
            port: dbAnhQuanConfig.port,
            user: dbAnhQuanConfig.user,
            password: dbAnhQuanConfig.password,
          }
        ];
      },
      inject: [MssqlAnhQuanConfig.KEY],
    }),
  ],
})
export class MssqlPersistentConfigModule { }
