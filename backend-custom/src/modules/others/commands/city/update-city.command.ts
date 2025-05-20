import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CityRepository } from '../../repositories/city.repository';
import { ProvinceRepository } from '../../repositories/province.repository';
import { UpdateCityDto } from '../../dto/city.dto';
import { City } from '../../models/others.model';

export class UpdateCityCommand implements ICommand {
  constructor(
    public readonly dto: UpdateCityDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateCityCommand)
export class UpdateCityCommandHandler
  implements ICommandHandler<UpdateCityCommand>
{
  private readonly logger = new Logger(UpdateCityCommand.name);

  constructor(
    private readonly repository: CityRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async execute(command: UpdateCityCommand): Promise<any> {
    const { dto } = command;

    // Check if city exists
    const existingCity = await this.repository.findById(dto.city_id);
    if (existingCity.rowCount == 0) {
      throw new NotFoundException(`City with ID ${dto.city_id} not found`);
    }

    // Check if province exists if province_id is provided
    if (dto.province_id) {
      const existingProvince = await this.provinceRepository.findById(dto.province_id);
      if (existingProvince.rowCount == 0) {
        throw new NotFoundException(`Province with ID ${dto.province_id} not found`);
      }
    }

    // Update city
    const result = await this.repository.update(dto);
    return new City(result.rows[0]);
  }
}
