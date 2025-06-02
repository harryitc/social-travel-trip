import { Logger, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';

export class CreateUserCommand implements ICommand {
  constructor(public readonly data: CreateUserDTO) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  private readonly logger = new Logger(CreateUserCommand.name);

  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { data } = command;

    // Check if username already exists
    const existingUser = await this.repository.getUserByUsername(data.username);
    if (existingUser.rowCount > 0) {
      throw new ConflictException(`Username ${data.username} is already taken`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with hashed password
    const result = await this.repository.createUser({
      ...data,
      password: hashedPassword,
    });

    return new User(result.rows[0]);
  }
}
