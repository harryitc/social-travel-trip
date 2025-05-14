
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MdienDanModel } from '../models/mdien-dan.model';


import { MdienDanRepository } from '../repositories/mdien-dan.repository';


export class CreateMdienDanCommand implements ICommand {
  constructor(
    public readonly args: {
      
      info: any;
      time_create: Date;
      time_update: Date;
    }
  ) {}
}

@CommandHandler(CreateMdienDanCommand)
export class CreateMdienDanCommandHandler
  implements ICommandHandler<CreateMdienDanCommand>
{
  private readonly logger = new Logger(CreateMdienDanCommand.name);

  constructor(
    
    
    private readonly repository: MdienDanRepository, 
    
  ) {}

  execute = async (command: CreateMdienDanCommand): Promise<any> => {
    const insertResult = await this.repository.create(command.args);
    
    
     const idCreated = insertResult.rows[0].user_id;
    
    return Promise.resolve(new MdienDanModel({user_id:idCreated}).getCreatedResponse);
  };
}

