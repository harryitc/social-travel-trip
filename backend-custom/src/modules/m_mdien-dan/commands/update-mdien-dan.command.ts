
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MdienDanModel } from '../models/mdien-dan.model';


import { MdienDanRepository } from '../repositories/mdien-dan.repository';


export class UpdateMdienDanCommand implements ICommand {
  constructor(public readonly agrs: {
    user_id: number,
    
    info: any;
    time_create: Date;
    time_update: Date;
  }) {}
}

@CommandHandler(UpdateMdienDanCommand)
export class UpdateMdienDanCommandHandler
  implements ICommandHandler<UpdateMdienDanCommand>
{
  constructor(
    
    
    private readonly repository: MdienDanRepository, 
    
  ) {}

  execute = async (command: UpdateMdienDanCommand): Promise<any> => {
    await this.repository.update(command.agrs);
    return Promise.resolve(new MdienDanModel({user_id: command.agrs.user_id}).getUpdatedResponse);
  };
}
