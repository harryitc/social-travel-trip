import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { CreateIfNotExistsHashtagDto } from '../../dto/hashtag.dto';
import { Hashtag } from '../../models/others.model';

export class CreateIfNotExistsHashtagCommand implements ICommand {
  constructor(
    public readonly dto: CreateIfNotExistsHashtagDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateIfNotExistsHashtagCommand)
export class CreateIfNotExistsHashtagCommandHandler
  implements ICommandHandler<CreateIfNotExistsHashtagCommand>
{
  private readonly logger = new Logger(CreateIfNotExistsHashtagCommand.name);

  constructor(private readonly repository: HashtagRepository) {}

  async execute(command: CreateIfNotExistsHashtagCommand): Promise<any> {
    const { dto } = command;

    // Create hashtag if not exists
    const result = await this.repository.createIfNotExists(dto.name);
    return new Hashtag(result.rows[0]);
  }
}
