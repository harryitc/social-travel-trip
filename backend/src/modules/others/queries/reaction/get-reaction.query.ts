import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ReactionRepository } from '../../repositories/reaction.repository';
import { GetReactionDto } from '../../dto/reaction.dto';
import { Reaction } from '../../models/others.model';

export class GetReactionQuery implements IQuery {
  constructor(
    public readonly dto: GetReactionDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetReactionQuery)
export class GetReactionQueryHandler
  implements IQueryHandler<GetReactionQuery>
{
  private readonly logger = new Logger(GetReactionQuery.name);

  constructor(private readonly repository: ReactionRepository) {}

  async execute(query: GetReactionQuery): Promise<any> {
    const { dto } = query;

    // Get reaction by ID
    const result = await this.repository.findById(dto.reaction_id);
    
    if (result.rowCount == 0) {
      throw new NotFoundException(`Reaction with ID ${dto.reaction_id} not found`);
    }
    
    return new Reaction(result.rows[0]);
  }
}
