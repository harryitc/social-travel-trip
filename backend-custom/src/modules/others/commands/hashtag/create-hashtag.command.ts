import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { CreateHashtagDto } from '../../dto/hashtag.dto';
import { Hashtag } from '../../models/others.model';

export class CreateHashtagCommand implements ICommand {
  constructor(
    public readonly dto: CreateHashtagDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateHashtagCommand)
export class CreateHashtagCommandHandler
  implements ICommandHandler<CreateHashtagCommand>
{
  private readonly logger = new Logger(CreateHashtagCommand.name);

  constructor(private readonly repository: HashtagRepository) {}

  async execute(command: CreateHashtagCommand): Promise<any> {
    const { dto } = command;

    // Create hashtag
    const result = await this.repository.create(dto);
    return new Hashtag(result.rows[0]);
  }
}
