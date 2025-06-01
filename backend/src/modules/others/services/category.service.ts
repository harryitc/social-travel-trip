import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCategoryDto, CreateIfNotExistsCategoryDto, DeleteCategoryDto, GetCategoryDto, QueryCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { CreateCategoryCommand } from '../commands/category/create-category.command';
import { UpdateCategoryCommand } from '../commands/category/update-category.command';
import { DeleteCategoryCommand } from '../commands/category/delete-category.command';
import { GetCategoryQuery } from '../queries/category/get-category.query';
import { QueryCategoriesQuery } from '../queries/category/query-categories.query';
import { CreateIfNotExistsCategoryCommand } from '../commands/category/create-if-not-exists-category.command';

@Injectable()
export class CategoryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateCategoryDto, userId: number) {
    return this.commandBus.execute(new CreateCategoryCommand(dto, userId));
  }

  async createIfNotExists(dto: CreateIfNotExistsCategoryDto, userId: number) {
    return this.commandBus.execute(new CreateIfNotExistsCategoryCommand(dto, userId));
  }

  async update(dto: UpdateCategoryDto, userId: number) {
    return this.commandBus.execute(new UpdateCategoryCommand(dto, userId));
  }

  async delete(dto: DeleteCategoryDto, userId: number) {
    return this.commandBus.execute(new DeleteCategoryCommand(dto, userId));
  }

  async getById(dto: GetCategoryDto, userId: number) {
    return this.queryBus.execute(new GetCategoryQuery(dto, userId));
  }

  async query(dto: QueryCategoryDto, userId: number) {
    return this.queryBus.execute(new QueryCategoriesQuery(dto, userId));
  }
}