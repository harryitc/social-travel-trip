import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a user follows another user
 */
export class NewFollowerEvent {
  constructor(
    public readonly userId: number,
    public readonly followerId: number,
    public readonly followerName: string,
  ) {}
}

/**
 * Handler for NewFollowerEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(NewFollowerEvent)
export class NewFollowerEventHandler
  implements IEventHandler<NewFollowerEvent>
{
  private readonly logger = new Logger(NewFollowerEventHandler.name);

  handle(event: NewFollowerEvent) {
    this.logger.debug(
      `NewFollowerEvent: User ${event.followerName} followed user ${event.userId}`,
    );
    return Promise.resolve();
  }
}
