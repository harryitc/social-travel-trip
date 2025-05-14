import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { MdienDanModel } from '../models/mdien-dan.model';

import { MdienDanRepository } from '../repositories/mdien-dan.repository';

export class FindOneMdienDanQuery {
  constructor(public readonly user_id: number) {}
}

@QueryHandler(FindOneMdienDanQuery)
export class FindOneMdienDanQueryHandler
  implements IQueryHandler<FindOneMdienDanQuery>
{
  constructor(private readonly repository: MdienDanRepository) {}

  async execute(query: FindOneMdienDanQuery) {
    const resultFounded = await this.repository.findOne(query.user_id);
    if (!resultFounded.rows[0]) {
      throw new NotFoundException(`Record: ${query.user_id} not found!`);
    }

    return new MdienDanModel(resultFounded.rows[0]).getOneResponse;
  }
}
