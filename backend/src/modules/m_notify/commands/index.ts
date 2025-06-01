import { CreateNotifyCommandHandler } from './create-notify.command';
import { UpdateNotifyCommandHandler } from './update-notify.command';
import { DeleteNotifyCommandHandler } from './delete-notify.command';
import { MarkReadNotifyCommandHandler } from './mark-read-notify.command';
import { MarkAllReadNotifyHandler } from './mark-all-read-notify.handler';

export const CommandHandlers = [
  CreateNotifyCommandHandler,
  UpdateNotifyCommandHandler,
  DeleteNotifyCommandHandler,
  MarkReadNotifyCommandHandler,
  MarkAllReadNotifyHandler,
];
