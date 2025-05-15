import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { PostRepository } from '../repositories/post.repository';

export class FindOneMdienDanQuery {
  constructor(public readonly user_id: number) {}
}

@QueryHandler(FindOneMdienDanQuery)
export class FindOneMdienDanQueryHandler
  implements IQueryHandler<FindOneMdienDanQuery>
{
  constructor(private readonly repository: PostRepository) {}

  async execute(query: FindOneMdienDanQuery) {
    // const resultFounded = await this.repository.findOne(query.user_id);
    // if (!resultFounded.rows[0]) {
    //   throw new NotFoundException(`Record: ${query.user_id} not found!`);
    // }

    // return new MdienDanModel(resultFounded.rows[0]).getOneResponse;
  }
}
