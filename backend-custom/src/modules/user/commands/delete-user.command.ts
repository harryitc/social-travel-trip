import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { DeleteUserDTO } from '../dto/user.dto';
import { User } from '../models/user.model';

export class DeleteUserCommand implements ICommand {
  constructor(
    public readonly data: DeleteUserDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  private readonly logger = new Logger(DeleteUserCommand.name);

  constructor(private readonly repository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<any> {
    const { data, userId } = command;

    // Verify user is deleting their own account or is admin
    if (data.user_id != userId) {
      // In a real app, check if user is admin here
      // For now, throw error if user tries to delete another user's account
      throw new UnauthorizedException(
        'You can only delete your own account unless you are an admin',
      );
    }

    const result = await this.repository.deleteUser(data.user_id);

    if (result.rowCount == 0) {
      throw new NotFoundException(`User with ID ${data.user_id} not found`);
    }

    return new User(result.rows[0]);
  }
}
