import { Module } from '@nestjs/common';
// import { TestModuleEntity } from '@modules/m_test-module/orm-entities/test-module.entity';

/**
 * name: TYPE_ORM_DATASOURCE_INJECT_TOKEN_MAIN_DATABASE
 * sẽ được dùng cho các module feaure dùng cùng kết nối đến cùng 1 db
 * ex:  TypeOrmModule.forFeature(
      [ProductEntity, ProductVariantEntity],
      TYPE_ORM_DATASOURCE_INJECT_TOKEN_MAIN_DATABASE,
    ),
 */
@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   name: TYPE_ORM_DATASOURCE_INJECT_TOKEN_AUTHENTICATE_DATABASE,
    //   imports: [ConfigModule.forFeature(POSTGRE_SQL_DB_CONFIG_AUTHENTICATION)],
    //   inject: [POSTGRE_SQL_DB_CONFIG_AUTHENTICATION.KEY],
    //   useFactory: (
    //     dbConfig: ConfigType<typeof POSTGRE_SQL_DB_CONFIG_AUTHENTICATION>,
    //   ) => {
    //     return {
    //       type: 'postgres',
    //       database: dbConfig.database,
    //       host: dbConfig.host,
    //       port: dbConfig.port,
    //       username: dbConfig.user,
    //       password: dbConfig.password,
    //       autoLoadEntities: false,
    //     };
    //   },
    // }),
  ],
})
export class TypeORMPersistentConfigModule {}
