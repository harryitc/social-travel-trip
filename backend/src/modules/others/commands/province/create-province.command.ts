import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProvinceRepository } from '../../repositories/province.repository';
import { CreateProvinceDto } from '../../dto/province.dto';
import { Province } from '../../models/others.model';

export class CreateProvinceCommand implements ICommand {
  constructor(
    public readonly dto: CreateProvinceDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateProvinceCommand)
export class CreateProvinceCommandHandler
  implements ICommandHandler<CreateProvinceCommand>
{
  private readonly logger = new Logger(CreateProvinceCommand.name);

  constructor(private readonly repository: ProvinceRepository) {}

  async execute(command: CreateProvinceCommand): Promise<any> {
    const { dto } = command;

    // Create province
    const result = await this.repository.create(dto);
    return new Province(result.rows[0]);
  }
}
