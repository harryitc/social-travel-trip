import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a user creates a new mini blog (to notify followers)
 */
export class NewMiniBlogFromFollowingEvent {
  constructor(
    public readonly followerIds: number[],
    public readonly miniBlogId: number,
    public readonly miniBlogCreatorId: number,
    public readonly miniBlogCreatorName: string,
  ) {}
}

/**
 * Handler for NewMiniBlogFromFollowingEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(NewMiniBlogFromFollowingEvent)
export class NewMiniBlogFromFollowingEventHandler
  implements IEventHandler<NewMiniBlogFromFollowingEvent>
{
  private readonly logger = new Logger(
    NewMiniBlogFromFollowingEventHandler.name,
  );

  handle(event: NewMiniBlogFromFollowingEvent) {
    this.logger.debug(
      `NewMiniBlogFromFollowingEvent: User ${event.miniBlogCreatorName} created mini blog ${event.miniBlogId}, notifying ${event.followerIds.length} followers`,
    );
    return Promise.resolve();
  }
}
