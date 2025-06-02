import { registerAs } from '@nestjs/config';
// NOTE CHUYEN DOI: tam su dung trong khi chuyen doi he thong phan quyen, sau nay delete
// export const OLD_CONNECTION_STRING_DEFAULT = 'DB_OLD';

export const CONNECTION_STRING_DEFAULT = 'DB_DEFAULT';
export const POSTGRE_SQL_DB_CONFIG_MAIN = registerAs(
  'postgreSQLMainDBConfig',
  () => ({
    host: process.env.PG_MAIN_DB_HOST,
    port: +process.env.PG_MAIN_DB_PORT,
    user: process.env.PG_MAIN_DB_USER,
    password: process.env.PG_MAIN_DB_PASSWORD,
    database: process.env.PG_MAIN_DB_DATABASE,
  }),
);

// NOTE CHUYEN DOI: tam su dung trong khi chuyen doi he thong phan quyen, sau nay delete
// export const POSTGRE_SQL_DB_CONFIG_OLD = registerAs(
//   'postgreSQLOldDBConfig',
//   () => ({
//     host: process.env.PG_OLD_DB_HOST,
//     port: +process.env.PG_OLD_DB_PORT,
//     user: process.env.PG_OLD_DB_USER,
//     password: process.env.PG_OLD_DB_PASSWORD,
//     database: process.env.PG_OLD_DB_DATABASE,
//   }),
// );

// Ket noi migration den co so du lieu chinh
export const CONNECTION_STRING_DEFAULT_MIGRATION =
  'CONNECTION_STRING_DEFAULT_MIGRATION';

export const MIGRATIONS_POSTGRE_SQL_DB_CONFIG_MAIN = registerAs(
  'postgreSQLMainDBConfig',
  () => ({
    host: process.env.MIGRATIONS_PG_MAIN_DB_HOST,
    port: +process.env.MIGRATIONS_PG_MAIN_DB_PORT,
    user: process.env.MIGRATIONS_PG_MAIN_DB_USER,
    password: process.env.MIGRATIONS_PG_MAIN_DB_PASSWORD,
    database: process.env.MIGRATIONS_PG_MAIN_DB_DATABASE,
  }),
);
