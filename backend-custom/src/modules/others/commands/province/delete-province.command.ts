import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProvinceRepository } from '../../repositories/province.repository';
import { DeleteProvinceDto } from '../../dto/province.dto';
import { Province } from '../../models/others.model';

export class DeleteProvinceCommand implements ICommand {
  constructor(
    public readonly dto: DeleteProvinceDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteProvinceCommand)
export class DeleteProvinceCommandHandler
  implements ICommandHandler<DeleteProvinceCommand>
{
  private readonly logger = new Logger(DeleteProvinceCommand.name);

  constructor(private readonly repository: ProvinceRepository) {}

  async execute(command: DeleteProvinceCommand): Promise<any> {
    const { dto } = command;

    // Check if province exists
    const existingProvince = await this.repository.findById(dto.province_id);
    if (existingProvince.rowCount == 0) {
      throw new NotFoundException(`Province with ID ${dto.province_id} not found`);
    }

    // Delete province
    const result = await this.repository.delete(dto.province_id);
    return new Province(result.rows[0]);
  }
}
