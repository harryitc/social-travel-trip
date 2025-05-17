import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';

@Injectable()
export class UserRelaRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}
}
