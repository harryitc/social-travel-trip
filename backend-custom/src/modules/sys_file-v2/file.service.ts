import { createReadStream } from 'fs';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { Delete, Injectable } from '@nestjs/common';
import { File } from './model/File.model';
import EventEmitter from 'events';
import { fromEvent, map } from 'rxjs';
import { FileUploadCommand } from './commands/file-upload.command';
import { FileGetListInfoQuery } from './queries/file-get-list.query';
import { FileGetInfoQuery } from './queries/file-get.query';
import { getFile } from './utils/file';
import { FileDeleteCommand } from './commands/file-delete.command';
import { FileDeleteDto } from './dto/file-delete.dto';

@Injectable()
export class FileService {
  constructor(
    // private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) { }

  /**
   * TODO: cache
   */
  async fileGetListInfo(list_server_file_name: string[], session_id?) {
    let data: File[] = await this.queryBus.execute(new FileGetListInfoQuery(list_server_file_name))
    for (let i = 0; i < data.length; i++) {
      const file = data[i];
      await file.setBlurHash()
    }

    if (session_id) {
      data.forEach(d => {
        this.eventEmitter.emit(session_id, { data: d });
      })
    }

    return data
  }

  async fileGetInfo(server_file_name) {
    let data: File = await this.queryBus.execute(new FileGetInfoQuery(server_file_name))
    return data
  }

  async fileDownload(server_file_name) {
    let file = await this.fileGetInfo(server_file_name)
    // return createReadStream(getFile(file.filepath, server_file_name))
    return createReadStream(getFile(`./${process.env.FILE_DIRECTORY_V2}/${file.filepath}`, server_file_name))
  }

  fileUpload(dto, files) {
    return this.commandBus.execute(
      new FileUploadCommand(
        dto.userId,
        dto.ext,
        dto.resize,
        dto.scale,
        files,
      ),
    );
  }

  async fileGetListResponse(session_id) {
    return fromEvent(this.eventEmitter, session_id).pipe(
      map((data: any) => { return data })
    );
  }

  async fileDelete(dto: FileDeleteDto) {
    return await this.commandBus.execute(new FileDeleteCommand(dto.list_server_file_name));
  }

}
