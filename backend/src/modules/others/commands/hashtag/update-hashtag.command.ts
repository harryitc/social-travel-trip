import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { UpdateHashtagDto } from '../../dto/hashtag.dto';
import { Hashtag } from '../../models/others.model';

export class UpdateHashtagCommand implements ICommand {
  constructor(
    public readonly dto: UpdateHashtagDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateHashtagCommand)
export class UpdateHashtagCommandHandler
  implements ICommandHandler<UpdateHashtagCommand>
{
  private readonly logger = new Logger(UpdateHashtagCommand.name);

  constructor(private readonly repository: HashtagRepository) {}

  async execute(command: UpdateHashtagCommand): Promise<any> {
    const { dto } = command;

    // Check if hashtag exists
    const existingHashtag = await this.repository.findById(dto.tag_id);
    if (existingHashtag.rowCount == 0) {
      throw new NotFoundException(`Hashtag with ID ${dto.tag_id} not found`);
    }

    // Update hashtag
    const result = await this.repository.update(dto);
    return new Hashtag(result.rows[0]);
  }
}
