import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a mini blog is liked
 */
export class MiniBlogLikeEvent {
  constructor(
    public readonly miniBlogOwnerId: number,
    public readonly miniBlogId: number,
    public readonly likerId: number,
    public readonly likerName: string,
  ) {}
}

/**
 * Handler for MiniBlogLikeEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(MiniBlogLikeEvent)
export class MiniBlogLikeEventHandler
  implements IEventHandler<MiniBlogLikeEvent>
{
  private readonly logger = new Logger(MiniBlogLikeEventHandler.name);

  handle(event: MiniBlogLikeEvent) {
    this.logger.debug(
      `MiniBlogLikeEvent: User ${event.likerName} liked mini blog ${event.miniBlogId}`,
    );
    return Promise.resolve();
  }
}
