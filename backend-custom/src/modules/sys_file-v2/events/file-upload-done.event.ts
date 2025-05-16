import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { File } from "../repository/file.model";

export class FileCreateDoneEvent {
  constructor(public readonly file: any) {}
}

@EventsHandler(FileCreateDoneEvent)
export class FileCreateDoneEventHandler
  implements IEventHandler<FileCreateDoneEvent>
{
  private readonly logger = new Logger(FileCreateDoneEventHandler.name);
  handle(event: FileCreateDoneEvent) {
    this.logger.debug(`FileCreateDoneEvent`);
    return;
  }
}
