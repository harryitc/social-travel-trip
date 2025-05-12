import * as sql from 'mssql';
import { Injectable, Logger } from '@nestjs/common';
import { ConnectionPool, Request } from 'mssql';

@Injectable()
export class ConnectionPoolMSSQL {
    private readonly logger = new Logger(ConnectionPoolMSSQL.name);

    constructor(private readonly pool: ConnectionPool) {
        pool.on('error', (err) => {
            this.logger.error(`Kết nối MSSQL database thất bại.${err}`)
        });
    }

    public static async createPool(data) {
        const pool = new sql.ConnectionPool({
            server: data.host,
            database: data.database,
            user: data.user,
            password: data.password,
            port: data.port,
            requestTimeout: 300000,
            options: {
                encrypt: false,
                requestTimeout: 300000
            },
            pool: {
                min: 1,
                max: 1000,
                idleTimeoutMillis: 2000
            }
        });
        // automatically remove the pool from the cache if `pool.close()` is called
        const close = pool.close.bind(pool);
        pool.close = (...args) => {
            return close(...args);
        }
        return pool.connect();
    }

    /**
     * tạo kết nối thông qua tham số
     */
    public static async createConnect(data) {
        return sql.connect({
            server: data.host,
            database: data.database,
            user: data.user,
            password: data.password,
            port: data.port,
            requestTimeout: 300000,
            options: {
                encrypt: false,
                requestTimeout: 300000
            },
            pool: {
                min: 1,
                max: 1000,
                idleTimeoutMillis: 2000
            }
        });
    }

    /**
     * chạy truy vấn
     */
    public runQuery(): Request {
        return this.pool.request()
    }

    public close() {
        return this.pool.close()
    }
}