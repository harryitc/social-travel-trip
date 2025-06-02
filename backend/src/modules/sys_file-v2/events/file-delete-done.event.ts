import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { File } from "../repository/file.model";

export class FileDeleteDoneEvent {
  constructor(public readonly file: any) {}
}

@EventsHandler(FileDeleteDoneEvent)
export class FileDeleteDoneEventHandler
  implements IEventHandler<FileDeleteDoneEvent>
{
  private readonly logger = new Logger(FileDeleteDoneEventHandler.name);
  handle(event: FileDeleteDoneEvent) {
    this.logger.debug(`FileDeleteDoneEvent`);
    return;
  }
}
