import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ReactionRepository } from '../../repositories/reaction.repository';
import { CreateReactionDto } from '../../dto/reaction.dto';
import { Reaction } from '../../models/others.model';

export class CreateReactionCommand implements ICommand {
  constructor(
    public readonly dto: CreateReactionDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateReactionCommand)
export class CreateReactionCommandHandler
  implements ICommandHandler<CreateReactionCommand>
{
  private readonly logger = new Logger(CreateReactionCommand.name);

  constructor(private readonly repository: ReactionRepository) {}

  async execute(command: CreateReactionCommand): Promise<any> {
    const { dto } = command;

    // Create reaction
    const result = await this.repository.create(dto);
    return new Reaction(result.rows[0]);
  }
}
