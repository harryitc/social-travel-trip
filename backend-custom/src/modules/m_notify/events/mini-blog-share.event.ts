import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a mini blog is shared
 */
export class MiniBlogShareEvent {
  constructor(
    public readonly miniBlogOwnerId: number,
    public readonly miniBlogId: number,
    public readonly sharerId: number,
    public readonly sharerName: string,
    public readonly platform: string,
  ) {}
}

/**
 * Handler for MiniBlogShareEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(MiniBlogShareEvent)
export class MiniBlogShareEventHandler
  implements IEventHandler<MiniBlogShareEvent>
{
  private readonly logger = new Logger(MiniBlogShareEventHandler.name);

  handle(event: MiniBlogShareEvent) {
    this.logger.debug(
      `MiniBlogShareEvent: User ${event.sharerName} shared mini blog ${event.miniBlogId} on ${event.platform}`,
    );
    return Promise.resolve();
  }
}
