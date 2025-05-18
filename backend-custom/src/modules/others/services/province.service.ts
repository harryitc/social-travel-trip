import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProvinceDto, DeleteProvinceDto, GetProvinceDto, QueryProvinceDto, UpdateProvinceDto } from '../dto/province.dto';
import { CreateProvinceCommand } from '../commands/province/create-province.command';
import { UpdateProvinceCommand } from '../commands/province/update-province.command';
import { DeleteProvinceCommand } from '../commands/province/delete-province.command';
import { GetProvinceQuery } from '../queries/province/get-province.query';
import { QueryProvincesQuery } from '../queries/province/query-provinces.query';

@Injectable()
export class ProvinceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateProvinceDto, userId: number) {
    return this.commandBus.execute(new CreateProvinceCommand(dto, userId));
  }

  async update(dto: UpdateProvinceDto, userId: number) {
    return this.commandBus.execute(new UpdateProvinceCommand(dto, userId));
  }

  async delete(dto: DeleteProvinceDto, userId: number) {
    return this.commandBus.execute(new DeleteProvinceCommand(dto, userId));
  }

  async getById(dto: GetProvinceDto, userId: number) {
    return this.queryBus.execute(new GetProvinceQuery(dto, userId));
  }

  async query(dto: QueryProvinceDto, userId: number) {
    return this.queryBus.execute(new QueryProvincesQuery(dto, userId));
  }
}
