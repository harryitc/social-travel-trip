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
import { ReactionService } from '../services/reaction.service';
import { CreateReactionDto, DeleteReactionDto, GetReactionDto, QueryReactionDto, UpdateReactionDto } from '../dto/reaction.dto';

@ApiTags('Reactions')
@ApiBearerAuth('jwt')
@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionController {
  constructor(private readonly service: ReactionService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new reaction' })
  async create(@Body() dto: CreateReactionDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.create(dto, userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update a reaction' })
  async update(@Body() dto: UpdateReactionDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.update(dto, userId);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a reaction' })
  async delete(@Body() dto: DeleteReactionDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.delete(dto, userId);
  }

  @Post('get-by-id')
  @ApiOperation({ summary: 'Get reaction by ID' })
  @HttpCode(200)
  async getById(@Body() dto: GetReactionDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getById(dto, userId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query reactions with pagination' })
  @HttpCode(200)
  async query(@Body() dto: QueryReactionDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.query(dto, userId);
  }
}
