import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CategoryRepository } from '../../repositories/category.repository';
import { CreateIfNotExistsCategoryDto } from '../../dto/category.dto';
import { Category } from '../../models/others.model';

export class CreateIfNotExistsCategoryCommand implements ICommand {
  constructor(
    public readonly dto: CreateIfNotExistsCategoryDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateIfNotExistsCategoryCommand)
export class CreateIfNotExistsCategoryCommandHandler
  implements ICommandHandler<CreateIfNotExistsCategoryCommand>
{
  private readonly logger = new Logger(CreateIfNotExistsCategoryCommand.name);

  constructor(private readonly repository: CategoryRepository) {}

  async execute(command: CreateIfNotExistsCategoryCommand): Promise<any> {
    const { dto } = command;

    // Create category if not exists
    const result = await this.repository.createIfNotExists(dto.name);
    return new Category(result.rows[0]);
  }
}
