import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { FileRepository } from '../repository/file.repository';

export class FileDeleteCommand implements ICommand {
  constructor(public readonly file_ids: string[]) {}
}

@CommandHandler(FileDeleteCommand)
export class FileDeleteCommandHandler
  implements ICommandHandler<FileDeleteCommand>
{
  private readonly logger = new Logger(FileDeleteCommand.name);
  constructor(private readonly repository: FileRepository) {}

  async execute(command: FileDeleteCommand): Promise<any> {
    this.logger.debug(`FileDeleteCommandHandler`);

    const result = await this.repository.deleteMany(command.file_ids);

    return result.rows;
  }
}
