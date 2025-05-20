import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CityRepository } from '../../repositories/city.repository';
import { DeleteCityDto } from '../../dto/city.dto';
import { City } from '../../models/others.model';

export class DeleteCityCommand implements ICommand {
  constructor(
    public readonly dto: DeleteCityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteCityCommand)
export class DeleteCityCommandHandler
  implements ICommandHandler<DeleteCityCommand>
{
  private readonly logger = new Logger(DeleteCityCommand.name);

  constructor(private readonly repository: CityRepository) {}

  async execute(command: DeleteCityCommand): Promise<any> {
    const { dto } = command;

    // Check if city exists
    const existingCity = await this.repository.findById(dto.city_id);
    if (existingCity.rowCount == 0) {
      throw new NotFoundException(`City with ID ${dto.city_id} not found`);
    }

    // Delete city
    const result = await this.repository.delete(dto.city_id);
    return new City(result.rows[0]);
  }
}
