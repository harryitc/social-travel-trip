import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import {
  POSTGRE_SQL_DB_CONFIG_MAIN,
  MIGRATIONS_POSTGRE_SQL_DB_CONFIG_MAIN,
  CONNECTION_STRING_DEFAULT,
  CONNECTION_STRING_DEFAULT_MIGRATION,
  // POSTGRE_SQL_DB_CONFIG_OLD,
  // OLD_CONNECTION_STRING_DEFAULT,
} from './configuration';

/**
 * Module này sẽ chứa tất cả các kết nối đến cơ sở dữ liệu posgresql
 * Chỉ được import 1 lần tại AppModule.
 * Các module tính năng khi import chỉ cần import: [PostgresModule.forFeature(CONNECTION)]
 */
@Module({
  imports: [
    PostgresModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(POSTGRE_SQL_DB_CONFIG_MAIN),
        // ConfigModule.forFeature(POSTGRE_SQL_DB_CONFIG_OLD),
        ConfigModule.forFeature(MIGRATIONS_POSTGRE_SQL_DB_CONFIG_MAIN),
      ],
      inject: [
        POSTGRE_SQL_DB_CONFIG_MAIN.KEY,
        // POSTGRE_SQL_DB_CONFIG_OLD.KEY,
        MIGRATIONS_POSTGRE_SQL_DB_CONFIG_MAIN.KEY,
      ],
      useFactory: (
        dbConfig: ConfigType<typeof POSTGRE_SQL_DB_CONFIG_MAIN>,
        // dbOldConfig: ConfigType<typeof POSTGRE_SQL_DB_CONFIG_OLD>,
        migrations: ConfigType<typeof MIGRATIONS_POSTGRE_SQL_DB_CONFIG_MAIN>,
      ) => {
        // Kết nối database chính
        const DB_CONFIG_MAIN = {
          name: CONNECTION_STRING_DEFAULT,
          database: dbConfig.database,
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
        };

        // // db permission cu
        // const DB_CONFIG_OLD = {
        //   name: OLD_CONNECTION_STRING_DEFAULT,
        //   database: dbOldConfig.database,
        //   host: dbOldConfig.host,
        //   port: dbOldConfig.port,
        //   user: dbOldConfig.user,
        //   password: dbOldConfig.password,
        // };
        // const DB_CONFIG_PERMISSION = {
        //   name: CONNECTION_STRING_PERMISSION,
        //   database: dbPermissionConfig.database,
        //   host: dbPermissionConfig.host,
        //   port: dbPermissionConfig.port,
        //   user: dbPermissionConfig.user,
        //   password: dbPermissionConfig.password,
        // };

        const MIGRATION_DB_MAIN = {
          name: CONNECTION_STRING_DEFAULT_MIGRATION,
          database: migrations.database,
          host: migrations.host,
          port: migrations.port,
          user: migrations.user,
          password: migrations.password,
        };

        // Thêm các connection với db loại postgres bên dưới ...
        // const SUB_DB_CONFIG = {...};

        return [
          DB_CONFIG_MAIN, 
          // DB_CONFIG_OLD, 
          MIGRATION_DB_MAIN];
      },
    }),
  ],
})
export class PortgresqlPersistentConfigModule {}
