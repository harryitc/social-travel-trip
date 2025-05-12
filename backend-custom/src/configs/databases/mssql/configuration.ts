import { registerAs } from '@nestjs/config';

// NOTE CHUYEN DOI: tam su dung trong khi chuyen doi he thong phan quyen, sau nay delete
// MSSQL anh quan
export const MSSQL_ANH_QUAN = "MSSQL_ANH_QUAN"
export const MssqlAnhQuanConfig = registerAs('dbAnhQuanConfig', () => ({
  host: process.env.SQL_HOST_ANH_QUAN,
  port: +process.env.SQL_PORT_ANH_QUAN,
  user: process.env.SQL_USER_ANH_QUAN,
  password: process.env.SQL_PASSWORD_ANH_QUAN,
  database: process.env.SQL_DATABASE_ANH_QUAN,
}));