
import { CreateMdienDanCommandHandler } from './create-mdien-dan.command';


import { DeleleMdienDanCommandHandler } from './delete-mdien-dan.command';


import { UpdateMdienDanCommandHandler } from './update-mdien-dan.command';


import { DeleteManyMdienDanCommandHandler } from './delete-many-mdien-dan.command';


export const CommandHandlers = [
   
  DeleleMdienDanCommandHandler,
  
  
  CreateMdienDanCommandHandler,
  
  
  UpdateMdienDanCommandHandler,
  
  
   DeleteManyMdienDanCommandHandler,
  
];
