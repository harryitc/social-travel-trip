import { CreateNotifyCommandHandler } from './create-notify.command';
import { UpdateNotifyCommandHandler } from './update-notify.command';
import { DeleteNotifyCommandHandler } from './delete-notify.command';
import { MarkReadNotifyCommandHandler } from './mark-read-notify.command';

export const CommandHandlers = [
  CreateNotifyCommandHandler,
  UpdateNotifyCommandHandler,
  DeleteNotifyCommandHandler,
  MarkReadNotifyCommandHandler,
];
