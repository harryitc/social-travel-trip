import { Inject } from '@nestjs/common';
import { DEFAULT } from './mssql-core.module';
import { generateConnectionMSSQLToken } from './mssql.module';

export function ConnectionMSSQL(name: string = DEFAULT) {
  return Inject(generateConnectionMSSQLToken(name));
}
