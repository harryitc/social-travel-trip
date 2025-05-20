import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a user creates a new post (to notify followers)
 */
export class NewPostFromFollowingEvent {
  constructor(
    public readonly followerIds: number[],
    public readonly postId: number,
    public readonly postCreatorId: number,
    public readonly postCreatorName: string,
  ) {}
}

/**
 * Handler for NewPostFromFollowingEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(NewPostFromFollowingEvent)
export class NewPostFromFollowingEventHandler
  implements IEventHandler<NewPostFromFollowingEvent>
{
  private readonly logger = new Logger(NewPostFromFollowingEventHandler.name);

  handle(event: NewPostFromFollowingEvent) {
    this.logger.debug(
      `NewPostFromFollowingEvent: User ${event.postCreatorName} created post ${event.postId}, notifying ${event.followerIds.length} followers`,
    );
    return Promise.resolve();
  }
}
