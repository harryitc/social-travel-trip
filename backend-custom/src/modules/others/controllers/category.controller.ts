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
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, CreateIfNotExistsCategoryDto, DeleteCategoryDto, GetCategoryDto, QueryCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@ApiTags('Categories')
@ApiBearerAuth('jwt')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new category' })
  async create(@Body() dto: CreateCategoryDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.create(dto, userId);
  }

  @Post('create-if-not-exists')
  @ApiOperation({ summary: 'Create a category if it does not exist' })
  async createIfNotExists(@Body() dto: CreateIfNotExistsCategoryDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.createIfNotExists(dto, userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update a category' })
  async update(@Body() dto: UpdateCategoryDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.update(dto, userId);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a category' })
  async delete(@Body() dto: DeleteCategoryDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.delete(dto, userId);
  }

  @Post('get-by-id')
  @ApiOperation({ summary: 'Get category by ID' })
  @HttpCode(200)
  async getById(@Body() dto: GetCategoryDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getById(dto, userId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query categories with pagination' })
  @HttpCode(200)
  async query(@Body() dto: QueryCategoryDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.query(dto, userId);
  }
}