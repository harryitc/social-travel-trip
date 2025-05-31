import { MarkAllReadNotifyDto } from '../dto/mark-all-read-notify.dto';

/**
 * Command to mark all notifications as read for a user
 */
export class MarkAllReadNotifyCommand {
  constructor(
    public readonly dto: MarkAllReadNotifyDto,
    public readonly userId: number,
  ) {}
}
