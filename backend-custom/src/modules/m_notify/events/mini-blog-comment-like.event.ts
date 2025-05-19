import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a mini blog comment is liked
 */
export class MiniBlogCommentLikeEvent {
  constructor(
    public readonly commentOwnerId: number,
    public readonly miniBlogId: number,
    public readonly commentId: number,
    public readonly likerId: number,
    public readonly likerName: string,
  ) {}
}

/**
 * Handler for MiniBlogCommentLikeEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(MiniBlogCommentLikeEvent)
export class MiniBlogCommentLikeEventHandler implements IEventHandler<MiniBlogCommentLikeEvent> {
  private readonly logger = new Logger(MiniBlogCommentLikeEventHandler.name);
  
  handle(event: MiniBlogCommentLikeEvent) {
    this.logger.debug(`MiniBlogCommentLikeEvent: User ${event.likerName} liked comment ${event.commentId} on mini blog ${event.miniBlogId}`);
    return Promise.resolve();
  }
}
