import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ReactionRepository } from '../../repositories/reaction.repository';
import { UpdateReactionDto } from '../../dto/reaction.dto';
import { Reaction } from '../../models/others.model';

export class UpdateReactionCommand implements ICommand {
  constructor(
    public readonly dto: UpdateReactionDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateReactionCommand)
export class UpdateReactionCommandHandler
  implements ICommandHandler<UpdateReactionCommand>
{
  private readonly logger = new Logger(UpdateReactionCommand.name);

  constructor(private readonly repository: ReactionRepository) {}

  async execute(command: UpdateReactionCommand): Promise<any> {
    const { dto } = command;

    // Check if reaction exists
    const existingReaction = await this.repository.findById(dto.reaction_id);
    if (existingReaction.rowCount === 0) {
      throw new NotFoundException(`Reaction with ID ${dto.reaction_id} not found`);
    }

    // Update reaction
    const result = await this.repository.update(dto);
    return new Reaction(result.rows[0]);
  }
}
