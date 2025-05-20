import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProvinceRepository } from '../../repositories/province.repository';
import { UpdateProvinceDto } from '../../dto/province.dto';
import { Province } from '../../models/others.model';

export class UpdateProvinceCommand implements ICommand {
  constructor(
    public readonly dto: UpdateProvinceDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateProvinceCommand)
export class UpdateProvinceCommandHandler
  implements ICommandHandler<UpdateProvinceCommand>
{
  private readonly logger = new Logger(UpdateProvinceCommand.name);

  constructor(private readonly repository: ProvinceRepository) {}

  async execute(command: UpdateProvinceCommand): Promise<any> {
    const { dto } = command;

    // Check if province exists
    const existingProvince = await this.repository.findById(dto.province_id);
    if (existingProvince.rowCount == 0) {
      throw new NotFoundException(`Province with ID ${dto.province_id} not found`);
    }

    // Update province
    const result = await this.repository.update(dto);
    return new Province(result.rows[0]);
  }
}
