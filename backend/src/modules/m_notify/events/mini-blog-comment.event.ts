import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a mini blog is commented
 */
export class MiniBlogCommentEvent {
  constructor(
    public readonly miniBlogOwnerId: number,
    public readonly miniBlogId: number,
    public readonly commentId: number,
    public readonly commenterId: number,
    public readonly commenterName: string,
  ) {}
}

/**
 * Handler for MiniBlogCommentEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(MiniBlogCommentEvent)
export class MiniBlogCommentEventHandler
  implements IEventHandler<MiniBlogCommentEvent>
{
  private readonly logger = new Logger(MiniBlogCommentEventHandler.name);

  handle(event: MiniBlogCommentEvent) {
    this.logger.debug(
      `MiniBlogCommentEvent: User ${event.commenterName} commented on mini blog ${event.miniBlogId}`,
    );
    return Promise.resolve();
  }
}
