import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { UpdateShareInfoDTO } from '../dto/share-mini-blog.dto';

export class UpdateShareInfoCommand implements ICommand {
  constructor(
    public readonly data: UpdateShareInfoDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(UpdateShareInfoCommand)
export class UpdateShareInfoCommandHandler
  implements ICommandHandler<UpdateShareInfoCommand>
{
  private readonly logger = new Logger(UpdateShareInfoCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: UpdateShareInfoCommand): Promise<any> => {
    const { data } = command;
    
    const updateResult = await this.repository.updateShareInfo(data);
    const updatedShare = updateResult.rows[0];
    
    return Promise.resolve(updatedShare);
  };
}
