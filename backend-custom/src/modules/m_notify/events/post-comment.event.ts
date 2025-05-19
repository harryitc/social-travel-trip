import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a post is commented
 */
export class PostCommentEvent {
  constructor(
    public readonly postOwnerId: number,
    public readonly postId: number,
    public readonly commentId: number,
    public readonly commenterId: number,
    public readonly commenterName: string,
  ) {}
}

/**
 * Handler for PostCommentEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(PostCommentEvent)
export class PostCommentEventHandler
  implements IEventHandler<PostCommentEvent>
{
  private readonly logger = new Logger(PostCommentEventHandler.name);

  handle(event: PostCommentEvent) {
    this.logger.debug(
      `PostCommentEvent: User ${event.commenterName} commented on post ${event.postId}`,
    );
    return Promise.resolve();
  }
}
