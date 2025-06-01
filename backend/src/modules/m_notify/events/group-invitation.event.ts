import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event emitted when a user is invited to a group
 */
export class GroupInvitationEvent {
  constructor(
    public readonly invitedUserId: number,
    public readonly groupId: number,
    public readonly groupName: string,
    public readonly inviterId: number,
    public readonly inviterName: string,
    public readonly invitationId: number,
  ) {}
}

/**
 * Handler for GroupInvitationEvent
 * This is just a placeholder handler for logging purposes
 * The actual notification logic will be handled by the saga
 */
@EventsHandler(GroupInvitationEvent)
export class GroupInvitationEventHandler
  implements IEventHandler<GroupInvitationEvent>
{
  private readonly logger = new Logger(GroupInvitationEventHandler.name);

  handle(event: GroupInvitationEvent) {
    this.logger.debug(
      `GroupInvitationEvent: User ${event.inviterName} invited user ${event.invitedUserId} to group ${event.groupName}`,
    );
    return Promise.resolve();
  }
}
