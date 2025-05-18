import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { GetHashtagDto } from '../../dto/hashtag.dto';
import { Hashtag } from '../../models/others.model';

export class GetHashtagQuery implements IQuery {
  constructor(
    public readonly dto: GetHashtagDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetHashtagQuery)
export class GetHashtagQueryHandler
  implements IQueryHandler<GetHashtagQuery>
{
  private readonly logger = new Logger(GetHashtagQuery.name);

  constructor(private readonly repository: HashtagRepository) {}

  async execute(query: GetHashtagQuery): Promise<any> {
    const { dto } = query;

    // Get hashtag by ID
    const result = await this.repository.findById(dto.tag_id);
    
    if (result.rowCount === 0) {
      throw new NotFoundException(`Hashtag with ID ${dto.tag_id} not found`);
    }
    
    return new Hashtag(result.rows[0]);
  }
}
