import _ from 'lodash';
import { Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileRepository } from '../repository/file.repository';
import { File } from '../model/File.model';
import { NotFoundException } from '@common/exceptions';

export class FileGetInfoQuery implements IQuery {
  public readonly file_id: string;

  constructor(file_id) {
    this.file_id = file_id;
  }
}

@QueryHandler(FileGetInfoQuery)
export class FileGetInfoQueryHandler
  implements IQueryHandler<FileGetInfoQuery>
{
  private readonly logger = new Logger(FileGetInfoQueryHandler.name);
  constructor(private readonly repo: FileRepository) {}

  async execute(query: FileGetInfoQuery): Promise<File> {
    let result = await this.repo.getOne(query.file_id);

    if (result.rowCount === 0) {
      throw new NotFoundException('File not found')
    }

    return new File(result.rows[0]);
  }
}
