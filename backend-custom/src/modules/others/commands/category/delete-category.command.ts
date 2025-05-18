import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CategoryRepository } from '../../repositories/category.repository';
import { DeleteCategoryDto } from '../../dto/category.dto';
import { Category } from '../../models/others.model';

export class DeleteCategoryCommand implements ICommand {
  constructor(
    public readonly dto: DeleteCategoryDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryCommandHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  private readonly logger = new Logger(DeleteCategoryCommand.name);

  constructor(private readonly repository: CategoryRepository) {}

  async execute(command: DeleteCategoryCommand): Promise<any> {
    const { dto } = command;

    // Check if category exists
    const existingCategory = await this.repository.findById(dto.category_id);
    if (existingCategory.rowCount === 0) {
      throw new NotFoundException(`Category with ID ${dto.category_id} not found`);
    }

    // Delete category
    const result = await this.repository.delete(dto.category_id);
    return new Category(result.rows[0]);
  }
}
