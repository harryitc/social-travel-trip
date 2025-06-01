import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { Injectable } from '@nestjs/common';
import format from 'pg-format';

@Injectable()
export class FileRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT) 
    private readonly pg: PgSQLConnectionPool,
  ) {}

  public async getList(fileIds) {
    let params: any = [
      fileIds,
    ];
    let queryText = `
      SELECT 
        file_system_id,
        file_type,
        client_filename,
        server_filename,
        file_group,
        filepath,
        file_ext,
        view_type,
        user_create,
        user_update,
        file_size,
        time_create,
        time_update,
        resize_path
      FROM file_system_v2
      WHERE server_filename = ANY($1::text[])
    `;
    return this.pg.execute(queryText, params);
  }

  public async getOne(fileId) {
    let params: any = [
      fileId,
    ];
    let queryText = `
      SELECT 
        file_system_id,
        file_type,
        client_filename,
        server_filename,
        file_group,
        filepath,
        file_ext,
        view_type,
        user_create,
        user_update,
        file_size,
        time_create,
        time_update,
        resize_path
      FROM file_system_v2
      WHERE server_filename = $1
    `;
    return this.pg.execute(queryText, params);
  }

  async create(userId, files): Promise<any> {
    let queryText = format(`
      INSERT INTO file_system_v2 (
        time_create,
        user_create,
        file_group,
        file_type,
        file_size,
        server_filename,
        client_filename,
        filepath,
        file_ext,
        view_type,
        resize_path
      ) VALUES %L
    `, files.map(file => {
      return [
        new Date(),
        userId,
        file.file_group,
        file.file_type,
        file.file_size,
        file.server_filename,
        file.client_filename,
        file.filepath,
        file.file_ext,
        file.view_type,
        file.resize_path,
      ]
    }))
    return this.pg.execute(queryText)
  }

  public async deleteMany(fileIds) {
    let params: any = [
      fileIds,
    ];
    let queryText = `
      DELETE FROM 
        file_system_v2
      WHERE 
        server_filename = ANY($1::text[])
    `;
    return this.pg.execute(queryText, params);
  }
}
