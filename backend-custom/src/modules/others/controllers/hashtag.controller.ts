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
import { HashtagService } from '../services/hashtag.service';
import {
  CreateIfNotExistsHashtagDto,
  DeleteHashtagDto,
  GetHashtagDto,
  QueryHashtagDto,
  UpdateHashtagDto,
} from '../dto/hashtag.dto';

@ApiTags('Hashtags')
@ApiBearerAuth('jwt')
@Controller('hashtags')
@UseGuards(JwtAuthGuard)
export class HashtagController {
  constructor(private readonly service: HashtagService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a hashtag if it does not exist' })
  async createIfNotExists(
    @Body() dto: CreateIfNotExistsHashtagDto,
    @Request() req: any,
  ) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.createIfNotExists(dto, userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update a hashtag' })
  async update(@Body() dto: UpdateHashtagDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.update(dto, userId);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a hashtag' })
  async delete(@Body() dto: DeleteHashtagDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.delete(dto, userId);
  }

  @Post('get-by-id')
  @ApiOperation({ summary: 'Get hashtag by ID' })
  @HttpCode(200)
  async getById(@Body() dto: GetHashtagDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getById(dto, userId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query hashtags with pagination' })
  @HttpCode(200)
  async query(@Body() dto: QueryHashtagDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.query(dto, userId);
  }
}
