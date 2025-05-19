import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CityRepository } from '../../repositories/city.repository';
import { ProvinceRepository } from '../../repositories/province.repository';
import { CreateCityDto } from '../../dto/city.dto';
import { City } from '../../models/others.model';

export class CreateCityCommand implements ICommand {
  constructor(
    public readonly dto: CreateCityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateCityCommand)
export class CreateCityCommandHandler
  implements ICommandHandler<CreateCityCommand>
{
  private readonly logger = new Logger(CreateCityCommand.name);

  constructor(
    private readonly repository: CityRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async execute(command: CreateCityCommand): Promise<any> {
    const { dto } = command;

    // Check if province exists
    const existingProvince = await this.provinceRepository.findById(dto.province_id);
    if (existingProvince.rowCount == 0) {
      throw new NotFoundException(`Province with ID ${dto.province_id} not found`);
    }

    // Create city
    const result = await this.repository.create(dto);
    return new City(result.rows[0]);
  }
}
