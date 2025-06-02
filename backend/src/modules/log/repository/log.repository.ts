import { Injectable } from "@nestjs/common";
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { DATABASE_PROVIDERS } from "../dependencies";
import format from 'pg-format';
import { Log } from "./log.model";
import { DATE } from "../../../common/utils/date-time";


@Injectable()
export class LogRepository {
  constructor(
    @PgSQLConnection(DATABASE_PROVIDERS)
    private readonly pg: PgSQLConnectionPool,
  ) { }

  async createTable(): Promise<any> {
    let queryText = `
      CREATE TABLE IF NOT EXISTS "$Log"
      (
        key_unit character varying NOT NULL,
        key_item character varying NOT NULL,
        time_create timestamp(6) without time zone,
        log_content jsonb DEFAULT '{}'::jsonb
      )
    `
    return this.pg.execute(queryText)
  }

  async getList(option, limit, offset): Promise<any[]> {
    let queryText = `
      SELECT
        key_unit,
        key_item,
        time_create,
        log_content
      FROM "$Log"
      WHERE key_unit = $1
      ORDER BY time_create DESC
      LIMIT $2
      OFFSET $3
    `
    let params = [
      option.key_unit,
      limit,
      offset,
    ];

    return this.pg.execute(queryText, params).then((result) => {
      return result.rows
    });
  }

  async create(logs: Log[]): Promise<any> {
    let queryText = format(`
      INSERT INTO "$Log" (
        key_unit,
        key_item,
        time_create,
        log_content
      ) VALUES %L
    `, logs.map(log => {
      return [
        log.key_unit,
        log.key_item,
        DATE.formatDatabaseDateTime(log.time_create),
        JSON.stringify(log.log_content)
      ]
    }))
    return this.pg.execute(queryText)
  }

  async clear(key_unit): Promise<any> {
    let queryText = `
      DELETE FROM "$Log" 
      WHERE key_unit = $1
    `
    let params = [key_unit];
    return this.pg.execute(queryText, params)
  }
}
