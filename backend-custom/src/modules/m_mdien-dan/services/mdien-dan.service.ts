import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { DeleteMdienDanDTO } from '../dto/delete-mdien-dan.dto';
import { DeleleMdienDanCommand } from '../commands/delete-mdien-dan.command';


import { CreateMdienDanDTO } from '../dto/create-mdien-dan.dto';
import { CreateMdienDanCommand } from '../commands/create-mdien-dan.command';


import { UpdateMdienDanDTO } from '../dto/update-mdien-dan.dto';
import { UpdateMdienDanCommand } from '../commands/update-mdien-dan.command';


import { FindOneMdienDanQuery } from '../queries/find-one-mdien-dan.query';


   
import { DeleteMdienDanManyDTO } from '../dto/delete-many-mdien-dan.dto';
import { DeleteManyMdienDanCommand } from '../commands/delete-many-mdien-dan.command';


import { FilterMdienDanQuery } from '../queries/filter-mdien-dan.query';
import { FilterMdienDanDTO } from '../dto/filter-mdien-dan.dto';

import { MdienDanModel } from '../models/mdien-dan.model';

@Injectable()
export class MdienDanService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    
  ) {}

  /**
    You can call proxy to get nescesarry data then set data to model.
    const data = await this.proxy.findAll();
  */ 

  filter(dto: FilterMdienDanDTO, userId: string) {
    // You can update your code to query by userId, if it's not nescessarry please remove it.
    return this.queryBus.execute(new FilterMdienDanQuery(dto));
  }

  
  findOne(user_id: number) {
    return this.queryBus.execute(new FindOneMdienDanQuery(user_id));
  }
  
  
  
  create(dto: CreateMdienDanDTO) {
    const model = new MdienDanModel();
    model.create(dto);
    return this.commandBus.execute(
      new CreateMdienDanCommand(model.getModelCreated()),
    );
  }
  
  
  update(dto: UpdateMdienDanDTO) {
    const model = new MdienDanModel();
    model.update(dto);
    return this.commandBus.execute(
      new UpdateMdienDanCommand(model.getModelUpdated()),
    );
  }
  
  
  delete(dto:DeleteMdienDanDTO) {
    return this.commandBus.execute(new DeleleMdienDanCommand(dto.user_id));
  }
  

   
  deleteManyByIds(dto: DeleteMdienDanManyDTO) {
    return this.commandBus.execute(new DeleteManyMdienDanCommand(dto.arrayIds));
  }
  

  /**  
  updateManyById(dto: UpdateManyArray) {
    const updateInfo = dto.info.map((element) => {
      const model = new MdienDanModel();
      model.updateDescAndImage(element);
      return model.getUpdateDescAndImage();
    });
    return this.commandBus.execute(new UpdateManyCommand(updateInfo));
  }
  */
  // Tao san pham voi bien the mac dinh
  /**  
  createProductAndDefaultVariant(dto: CreateMdienDanDTO) {
    const model = new MdienDanModel();
    model.createByName(dto.name_default);
    const saveInfo = model.getCreatedByName();

    return this.commandBus.execute(
      new CreateProductAndDefaultVariantCommand(saveInfo, saveInfo),
    );
  }
  */

}
