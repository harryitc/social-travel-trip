import { Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import QueryStream from 'pg-query-stream';

@Injectable()
export class PgSQLConnectionPool {
  private readonly logger = new Logger(PgSQLConnectionPool.name);
  constructor(public readonly pool: Pool) {
    // the pool will emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    pool.on('error', (err) => {
      this.logger.error(`Unexpected error on idle client: ${err.message}`);
    });
  }

  public execute(query: string, params: any[] = []) {
    return this.pool.query(query, params);
  }

  public async transaction<T = any>(
    callback: (client: PoolClient) => Promise<T>,
  ) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async stream(query, params) {
    const client = await this.pool.connect();
    try {
      const stream = client.query(new QueryStream(query, params));

      stream.on('end', () => {
        this.logger.log(`Finished streaming data for table ${query}`);
        client.release();
      });

      stream.on('error', (err) => {
        this.logger.error(
          `Error streaming data for table ${query}: ${err.message}`,
          err.stack,
        );
        client.release();
      });
      return stream;
    } catch (error) {
      this.logger.error(
        `Error setting up stream for table ${query}: ${error.message}`,
        error.stack,
      );
      client.release();
    }
  }
}
