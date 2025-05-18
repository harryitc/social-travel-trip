import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { DeleteShareLinkDTO } from '../dto/share-mini-blog.dto';

export class DeleteShareLinkCommand implements ICommand {
  constructor(
    public readonly data: DeleteShareLinkDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(DeleteShareLinkCommand)
export class DeleteShareLinkCommandHandler
  implements ICommandHandler<DeleteShareLinkCommand>
{
  private readonly logger = new Logger(DeleteShareLinkCommand.name);

  constructor(private readonly repository: MiniBlogRepository) {}

  execute = async (command: DeleteShareLinkCommand): Promise<any> => {
    const { data } = command;
    
    const deleteResult = await this.repository.deleteShareLink(data.miniBlogShareableId);
    const deletedShareLink = deleteResult.rows[0];
    
    return Promise.resolve(deletedShareLink);
  };
}
