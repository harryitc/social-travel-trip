import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CategoryRepository } from '../../repositories/category.repository';
import { CreateCategoryDto } from '../../dto/category.dto';
import { Category } from '../../models/others.model';

export class CreateCategoryCommand implements ICommand {
  constructor(
    public readonly dto: CreateCategoryDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  private readonly logger = new Logger(CreateCategoryCommand.name);

  constructor(private readonly repository: CategoryRepository) {}

  async execute(command: CreateCategoryCommand): Promise<any> {
    const { dto } = command;

    // Create category
    const result = await this.repository.create(dto);
    return new Category(result.rows[0]);
  }
}
