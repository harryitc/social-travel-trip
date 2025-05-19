import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { ProvinceService } from '../services/province.service';
import { CreateProvinceDto, DeleteProvinceDto, GetProvinceDto, QueryProvinceDto, UpdateProvinceDto } from '../dto/province.dto';

@ApiTags('Provinces')
@ApiBearerAuth('jwt')
@Controller('provinces')
@UseGuards(JwtAuthGuard)
export class ProvinceController {
  constructor(private readonly service: ProvinceService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new province' })
  async create(@Body() dto: CreateProvinceDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.create(dto, userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update a province' })
  async update(@Body() dto: UpdateProvinceDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.update(dto, userId);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a province' })
  async delete(@Body() dto: DeleteProvinceDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.delete(dto, userId);
  }

  @Post('get-by-id')
  @ApiOperation({ summary: 'Get province by ID' })
  @HttpCode(200)
  async getById(@Body() dto: GetProvinceDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getById(dto, userId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query provinces with pagination' })
  @HttpCode(200)
  async query(@Body() dto: QueryProvinceDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.query(dto, userId);
  }
}
