import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a post is liked
 */
export class PostLikeEvent {
  constructor(
    public readonly postOwnerId: number,
    public readonly postId: number,
    public readonly likerId: number,
    public readonly likerName: string,
  ) {}
}

/**
 * Handler for PostLikeEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(PostLikeEvent)
export class PostLikeEventHandler implements IEventHandler<PostLikeEvent> {
  private readonly logger = new Logger(PostLikeEventHandler.name);

  handle(event: PostLikeEvent) {
    this.logger.debug(
      `PostLikeEvent: User ${event.likerName} liked post ${event.postId}`,
    );
    return Promise.resolve();
  }
}
