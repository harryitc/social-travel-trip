import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { CityService } from '../services/city.service';
import {
  CreateCityDto,
  DeleteCityDto,
  GetCityDto,
  QueryCityDto,
  UpdateCityDto,
} from '../dto/city.dto';

@ApiTags('Cities')
@ApiBearerAuth('jwt')
@Controller('cities')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly service: CityService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new city' })
  async create(@Body() dto: CreateCityDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.create(dto, userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update a city' })
  async update(@Body() dto: UpdateCityDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.update(dto, userId);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a city' })
  async delete(@Body() dto: DeleteCityDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.delete(dto, userId);
  }

  @Post('get-by-id')
  @ApiOperation({ summary: 'Get city by ID' })
  @HttpCode(200)
  async getById(@Body() dto: GetCityDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getById(dto, userId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query cities with pagination' })
  @HttpCode(200)
  async query(@Body() dto: QueryCityDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.query(dto, userId);
  }
}
