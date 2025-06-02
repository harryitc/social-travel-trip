import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a post is shared
 */
export class PostShareEvent {
  constructor(
    public readonly postOwnerId: number,
    public readonly postId: number,
    public readonly sharerId: number,
    public readonly sharerName: string,
  ) {}
}

/**
 * Handler for PostShareEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(PostShareEvent)
export class PostShareEventHandler implements IEventHandler<PostShareEvent> {
  private readonly logger = new Logger(PostShareEventHandler.name);

  handle(event: PostShareEvent) {
    this.logger.debug(
      `PostShareEvent: User ${event.sharerName} shared post ${event.postId}`,
    );
    return Promise.resolve();
  }
}
