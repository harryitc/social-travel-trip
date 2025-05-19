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
import { ActivityService } from '../services/activity.service';
import {
  CreateIfNotExistsActivityDto,
  DeleteActivityDto,
  GetActivityDto,
  QueryActivityDto,
  UpdateActivityDto,
} from '../dto/activity.dto';

@ApiTags('Activities')
@ApiBearerAuth('jwt')
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create an activity if it does not exist' })
  async createIfNotExists(
    @Body() dto: CreateIfNotExistsActivityDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createIfNotExists(dto, +userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update an activity' })
  async update(@Body() dto: UpdateActivityDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.update(dto, +userId);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete an activity' })
  async delete(@Body() dto: DeleteActivityDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.delete(dto, +userId);
  }

  @Post('get-by-id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @HttpCode(200)
  async getById(@Body() dto: GetActivityDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getById(dto, +userId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query activities with pagination' })
  @HttpCode(200)
  async query(@Body() dto: QueryActivityDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.query(dto, +userId);
  }
}
