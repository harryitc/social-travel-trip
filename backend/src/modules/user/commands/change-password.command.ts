import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { ChangePasswordDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';

export class ChangePasswordCommand implements ICommand {
  constructor(
    public readonly data: ChangePasswordDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  private readonly logger = new Logger(ChangePasswordCommand.name);

  constructor(private readonly repository: UserRepository) {}

  async execute(command: ChangePasswordCommand): Promise<any> {
    const { data, userId } = command;

    // Verify user is changing their own password or is admin
    if (data.user_id != userId) {
      // In a real app, check if user is admin here
      // For now, throw error if user tries to change another user's password
      throw new NotFoundException('You can only change your own password');
    }

    // Get current user data to verify old password
    const currentUser = await this.repository.getUserByID(data.user_id);

    if (currentUser.rowCount == 0) {
      throw new NotFoundException(`User with ID ${data.user_id} not found`);
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(
      data.old_password,
      currentUser.rows[0].password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.new_password, 10);

    // Update password
    const result = await this.repository.changePassword(
      data.user_id,
      hashedPassword,
    );

    return new User(result.rows[0]);
  }
}
