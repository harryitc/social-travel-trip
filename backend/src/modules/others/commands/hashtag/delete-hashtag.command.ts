import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { DeleteHashtagDto } from '../../dto/hashtag.dto';
import { Hashtag } from '../../models/others.model';

export class DeleteHashtagCommand implements ICommand {
  constructor(
    public readonly dto: DeleteHashtagDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteHashtagCommand)
export class DeleteHashtagCommandHandler
  implements ICommandHandler<DeleteHashtagCommand>
{
  private readonly logger = new Logger(DeleteHashtagCommand.name);

  constructor(private readonly repository: HashtagRepository) {}

  async execute(command: DeleteHashtagCommand): Promise<any> {
    const { dto } = command;

    // Check if hashtag exists
    const existingHashtag = await this.repository.findById(dto.tag_id);
    if (existingHashtag.rowCount == 0) {
      throw new NotFoundException(`Hashtag with ID ${dto.tag_id} not found`);
    }

    // Delete hashtag
    const result = await this.repository.delete(dto.tag_id);
    return new Hashtag(result.rows[0]);
  }
}
