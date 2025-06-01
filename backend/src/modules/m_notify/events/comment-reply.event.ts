import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a comment receives a reply
 */
export class CommentReplyEvent {
  constructor(
    public readonly commentOwnerId: number,
    public readonly postId: number,
    public readonly commentId: number,
    public readonly replyId: number,
    public readonly replierId: number,
    public readonly replierName: string,
  ) {}
}

/**
 * Handler for CommentReplyEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(CommentReplyEvent)
export class CommentReplyEventHandler
  implements IEventHandler<CommentReplyEvent>
{
  private readonly logger = new Logger(CommentReplyEventHandler.name);

  handle(event: CommentReplyEvent) {
    this.logger.debug(
      `CommentReplyEvent: User ${event.replierName} replied to comment ${event.commentId}`,
    );
    return Promise.resolve();
  }
}
