import { CreateUserCommandHandler } from './create-user.command';
import { UpdateUserCommandHandler } from './update-user.command';
import { ChangePasswordCommandHandler } from './change-password.command';
import { DeleteUserCommandHandler } from './delete-user.command';
import { UpdateProfileStatsCommandHandler, RecordProfileViewCommandHandler } from './update-profile-stats.command';

export const CommandHandlers = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  ChangePasswordCommandHandler,
  DeleteUserCommandHandler,
  UpdateProfileStatsCommandHandler,
  RecordProfileViewCommandHandler,
];
