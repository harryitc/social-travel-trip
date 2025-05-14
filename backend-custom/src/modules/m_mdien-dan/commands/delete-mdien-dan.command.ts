  
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { LogicErrorException } from '@common/exceptions';


import { MdienDanRepository } from '../repositories/mdien-dan.repository';


export class DeleleMdienDanCommand implements ICommand {
  constructor(public readonly user_id: number) {}
}

@CommandHandler(DeleleMdienDanCommand)
export class DeleleMdienDanCommandHandler
  implements ICommandHandler<DeleleMdienDanCommand>
{
  private readonly logger = new Logger(DeleleMdienDanCommand.name);

  constructor(
    
    
    private readonly repository: MdienDanRepository, 
    
  ) {}

  execute = async (command: DeleleMdienDanCommand): Promise<any> => {
    await this.repository.delete(command.user_id);
  };
}
