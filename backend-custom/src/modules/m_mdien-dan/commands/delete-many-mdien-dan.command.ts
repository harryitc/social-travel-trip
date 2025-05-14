  
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { LogicErrorException } from '@common/exceptions';
import { MdienDanModel } from '../models/mdien-dan.model';


import { MdienDanRepository } from '../repositories/mdien-dan.repository';


export class DeleteManyMdienDanCommand implements ICommand {
  constructor(public readonly arrayIds:Array<number>) {}
}

@CommandHandler(DeleteManyMdienDanCommand)
export class DeleteManyMdienDanCommandHandler
  implements ICommandHandler<DeleteManyMdienDanCommand>
{
  private readonly logger = new Logger(DeleteManyMdienDanCommand.name);

  constructor(
    
    
    private readonly repository: MdienDanRepository, 
    
  ) {}

  execute = async (command: DeleteManyMdienDanCommand): Promise<any> => {
    const deleteQueryResult = await this.repository.deleteManyByIds(command.arrayIds);
    
    
    return {
      success: deleteQueryResult.rows.length !== 0,
      affected: deleteQueryResult.rows.length,
      raws: deleteQueryResult.rows.map((element) => new MdienDanModel(element).getDeleteManyResponse),
    }
    
  };
}
