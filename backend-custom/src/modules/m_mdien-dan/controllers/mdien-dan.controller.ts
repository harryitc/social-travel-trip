import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  HttpCode,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FilterMdienDanDTO } from '../dto/filter-mdien-dan.dto';

import { CreateMdienDanDTO } from '../dto/create-post.dto';

import { MdienDanService } from '../services/mdien-dan.service';

import { UpdateMdienDanDTO } from '../dto/update-post.dto';

import { DeleteMdienDanDTO } from '../dto/delete-mdien-dan.dto';

import { DeleteMdienDanManyDTO } from '../dto/delete-many-mdien-dan.dto';

@ApiTags('API MdienDan')
@Controller('mdien-dan')
export class MdienDanController {
  constructor(private readonly service: MdienDanService) {}

  @Post('query')
  @ApiOperation({
    summary: `Query: paging, sorting, searching, filtering`,
    description: '',
  })
  @HttpCode(200)
  getByFilterPost(@Body() filterDTO: FilterMdienDanDTO, @Request() req: any) {
    const requestUID = req['user']?.id ?? 'test';
    return this.service.filter(filterDTO, requestUID);
  }

  @Get('find-one')
  @ApiOperation({
    summary: `Get one by user_id`,
    description: '',
  })
  @HttpCode(200)
  findOne(@Query('user_id') user_id: number) {
    return this.service.findOne(user_id);
  }

  @Post('create')
  @HttpCode(201)
  @ApiOperation({
    summary: ``,
    description: '',
  })
  create(@Body() dto: CreateMdienDanDTO) {
    return this.service.create(dto);
  }

  @Put('update-one')
  @ApiOperation({
    summary: ``,
    description: '',
  })
  updateOne(@Body() dto: UpdateMdienDanDTO) {
    return this.service.update(dto);
  }

  @Delete('delete')
  @ApiOperation({
    summary: `Delete one by user_id`,
    description: '',
  })
  delete(@Query() dto: DeleteMdienDanDTO) {
    return this.service.delete(dto);
  }

  @Post('delete-many-by-ids')
  @HttpCode(200)
  @ApiOperation({
    summary: `Delete many by user_id`,
    description: '',
  })
  deleteManyByIds(@Body() dto: DeleteMdienDanManyDTO) {
    return this.service.deleteManyByIds(dto);
  }

  /**
  @Post('create-product-and-variant')
  @ApiOperation({
    summary: ``,
    description: '',
  })
  createProductAndVariatn(@Body() dto: CreateMdienDanDTO) {
    return this.service.createProductAndDefaultVariant(dto);
  }

  @Put('update-many')
  @ApiOperation({
    summary: ``,
    description: '',
  }) 
  updateManyProduct(@Body() dto: UpdateManyArray) {
    return this.service.updateManyById(dto);
  }
  */
}
