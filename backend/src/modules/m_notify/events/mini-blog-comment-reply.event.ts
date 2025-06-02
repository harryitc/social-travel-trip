import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a mini blog comment receives a reply
 */
export class MiniBlogCommentReplyEvent {
  constructor(
    public readonly commentOwnerId: number,
    public readonly miniBlogId: number,
    public readonly commentId: number,
    public readonly replyId: number,
    public readonly replierId: number,
    public readonly replierName: string,
  ) {}
}

/**
 * Handler for MiniBlogCommentReplyEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(MiniBlogCommentReplyEvent)
export class MiniBlogCommentReplyEventHandler
  implements IEventHandler<MiniBlogCommentReplyEvent>
{
  private readonly logger = new Logger(MiniBlogCommentReplyEventHandler.name);

  handle(event: MiniBlogCommentReplyEvent) {
    this.logger.debug(
      `MiniBlogCommentReplyEvent: User ${event.replierName} replied to comment ${event.commentId} on mini blog ${event.miniBlogId}`,
    );
    return Promise.resolve();
  }
}
