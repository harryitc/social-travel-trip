import _ from 'lodash';
import { Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileRepository } from '../repository/file.repository';
import { File } from '../model/File.model';

export class FileGetListInfoQuery implements IQuery {
  public readonly file_ids: string;

  constructor(file_ids) {
    this.file_ids = file_ids;
  }
}

@QueryHandler(FileGetListInfoQuery)
export class FileGetListInfoQueryHandler
  implements IQueryHandler<FileGetListInfoQuery>
{
  private readonly logger = new Logger(FileGetListInfoQueryHandler.name);
  constructor(private readonly repo: FileRepository) {}

  async execute(query: FileGetListInfoQuery): Promise<File[]> {
    let result = await this.repo.getList(query.file_ids);

    if (result.rowCount === 0) {
      return [];
    }

    return result.rows.map((row) => new File(row));
  }
}
