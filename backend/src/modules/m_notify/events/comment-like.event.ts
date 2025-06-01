import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a comment is liked
 */
export class CommentLikeEvent {
  constructor(
    public readonly commentOwnerId: number,
    public readonly postId: number,
    public readonly commentId: number,
    public readonly likerId: number,
    public readonly likerName: string,
  ) {}
}

/**
 * Handler for CommentLikeEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(CommentLikeEvent)
export class CommentLikeEventHandler
  implements IEventHandler<CommentLikeEvent>
{
  private readonly logger = new Logger(CommentLikeEventHandler.name);

  handle(event: CommentLikeEvent) {
    this.logger.debug(
      `CommentLikeEvent: User ${event.likerName} liked comment ${event.commentId}`,
    );
    return Promise.resolve();
  }
}
