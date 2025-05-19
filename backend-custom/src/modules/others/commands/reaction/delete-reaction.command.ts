import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ReactionRepository } from '../../repositories/reaction.repository';
import { DeleteReactionDto } from '../../dto/reaction.dto';
import { Reaction } from '../../models/others.model';

export class DeleteReactionCommand implements ICommand {
  constructor(
    public readonly dto: DeleteReactionDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteReactionCommand)
export class DeleteReactionCommandHandler
  implements ICommandHandler<DeleteReactionCommand>
{
  private readonly logger = new Logger(DeleteReactionCommand.name);

  constructor(private readonly repository: ReactionRepository) {}

  async execute(command: DeleteReactionCommand): Promise<any> {
    const { dto } = command;

    // Check if reaction exists
    const existingReaction = await this.repository.findById(dto.reaction_id);
    if (existingReaction.rowCount == 0) {
      throw new NotFoundException(`Reaction with ID ${dto.reaction_id} not found`);
    }

    // Delete reaction
    const result = await this.repository.delete(dto.reaction_id);
    return new Reaction(result.rows[0]);
  }
}
