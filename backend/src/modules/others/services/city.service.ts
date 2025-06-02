import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCityDto, DeleteCityDto, GetCityDto, QueryCityDto, UpdateCityDto } from '../dto/city.dto';
import { CreateCityCommand } from '../commands/city/create-city.command';
import { UpdateCityCommand } from '../commands/city/update-city.command';
import { DeleteCityCommand } from '../commands/city/delete-city.command';
import { GetCityQuery } from '../queries/city/get-city.query';
import { QueryCitiesQuery } from '../queries/city/query-cities.query';

@Injectable()
export class CityService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateCityDto, userId: number) {
    return this.commandBus.execute(new CreateCityCommand(dto, userId));
  }

  async update(dto: UpdateCityDto, userId: number) {
    return this.commandBus.execute(new UpdateCityCommand(dto, userId));
  }

  async delete(dto: DeleteCityDto, userId: number) {
    return this.commandBus.execute(new DeleteCityCommand(dto, userId));
  }

  async getById(dto: GetCityDto, userId: number) {
    return this.queryBus.execute(new GetCityQuery(dto, userId));
  }

  async query(dto: QueryCityDto, userId: number) {
    return this.queryBus.execute(new QueryCitiesQuery(dto, userId));
  }
}
