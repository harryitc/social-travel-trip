import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CategoryRepository } from '../../repositories/category.repository';
import { UpdateCategoryDto } from '../../dto/category.dto';
import { Category } from '../../models/others.model';

export class UpdateCategoryCommand implements ICommand {
  constructor(
    public readonly dto: UpdateCategoryDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  private readonly logger = new Logger(UpdateCategoryCommand.name);

  constructor(private readonly repository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<any> {
    const { dto } = command;

    // Check if category exists
    const existingCategory = await this.repository.findById(dto.category_id);
    if (existingCategory.rowCount === 0) {
      throw new NotFoundException(`Category with ID ${dto.category_id} not found`);
    }

    // Update category
    const result = await this.repository.update(dto);
    return new Category(result.rows[0]);
  }
}
