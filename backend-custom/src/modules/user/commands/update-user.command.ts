import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDTO } from '../dto/user.dto';
import { User } from '../models/user.model';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly data: UpdateUserDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  private readonly logger = new Logger(UpdateUserCommand.name);

  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    const { data, userId } = command;

    // Verify user is updating their own profile or is admin
    if (data.user_id != userId) {
      // In a real app, check if user is admin here
      // For now, throw error if user tries to update another user's profile
      throw new NotFoundException('You can only update your own profile');
    }

    const result = await this.repository.updateUser(data);

    if (result.rowCount == 0) {
      throw new NotFoundException(`User with ID ${data.user_id} not found`);
    }

    return new User(result.rows[0]);
  }
}
