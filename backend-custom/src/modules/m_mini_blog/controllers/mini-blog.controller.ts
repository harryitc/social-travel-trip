import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MiniBlogService } from '../services/mini-blog.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { CreateMiniBlogDTO } from '../dto/create-mini-blog.dto';
import { DeleteMiniBlogDTO } from '../dto/delete-mini-blog.dto';
import { GetMiniBlogByIdDTO, GetMiniBlogDTO } from '../dto/get-mini-blog.dto';
import { CreateShareLinkDTO, DeleteShareLinkDTO, GetSharesListDTO, ShareMiniBlogDTO, UpdateShareInfoDTO } from '../dto/share-mini-blog.dto';
import { UpdateMiniBlogDTO } from '../dto/update-mini-blog.dto';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Mini Blog')
@Controller('mini-blog')
export class MiniBlogController {
  constructor(private readonly service: MiniBlogService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new mini blog',
    description: 'Create a new mini blog with title, description, and other details',
  })
  @HttpCode(201)
  async createMiniBlog(@Body() createMiniBlogDTO: CreateMiniBlogDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createMiniBlog(createMiniBlogDTO, userId);
  }

  @Post('query')
  @ApiOperation({
    summary: 'Get mini blogs with filtering, pagination, and sorting',
    description: 'Get all mini blogs or filter by user, search text, etc.',
  })
  @HttpCode(200)
  async getMiniBlogList(@Body() getMiniBlogDTO: GetMiniBlogDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getMiniBlogList(getMiniBlogDTO, userId);
  }

  @Get('get-by-id')
  @ApiOperation({
    summary: 'Get mini blog by ID',
    description: 'Get details of a specific mini blog by its ID',
  })
  async getMiniBlogById(@Query('miniBlogId') miniBlogId: number, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetMiniBlogByIdDTO = { miniBlogId: +miniBlogId };
    return this.service.getMiniBlogById(dto, userId);
  }

  @Post('update')
  @ApiOperation({
    summary: 'Update a mini blog',
    description: 'Update the content and details of a mini blog',
  })
  @HttpCode(200)
  async updateMiniBlog(@Body() updateMiniBlogDTO: UpdateMiniBlogDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateMiniBlog(updateMiniBlogDTO, userId);
  }

  @Post('delete')
  @ApiOperation({
    summary: 'Delete a mini blog',
    description: 'Delete a mini blog by its ID',
  })
  @HttpCode(200)
  async deleteMiniBlog(@Body() deleteMiniBlogDTO: DeleteMiniBlogDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deleteMiniBlog(deleteMiniBlogDTO, userId);
  }

  @Post('share')
  @ApiOperation({
    summary: 'Share a mini blog',
    description: 'Share a mini blog on various platforms like Facebook, X, etc.',
  })
  @HttpCode(200)
  async shareMiniBlog(@Body() shareMiniBlogDTO: ShareMiniBlogDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.shareMiniBlog(shareMiniBlogDTO, userId);
  }

  @Post('update-share')
  @ApiOperation({
    summary: 'Update share information',
    description: 'Update the information of a shared mini blog',
  })
  @HttpCode(200)
  async updateShareInfo(@Body() updateShareInfoDTO: UpdateShareInfoDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateShareInfo(updateShareInfoDTO, userId);
  }

  @Get('get-shares')
  @ApiOperation({
    summary: 'Get shares list',
    description: 'Get a list of all shares for a mini blog',
  })
  async getSharesList(@Query('miniBlogId') miniBlogId: number, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetSharesListDTO = { miniBlogId: +miniBlogId };
    return this.service.getSharesList(dto, userId);
  }

  @Post('create-share-link')
  @ApiOperation({
    summary: 'Create a share link',
    description: 'Create a custom share link for a mini blog',
  })
  @HttpCode(201)
  async createShareLink(@Body() createShareLinkDTO: CreateShareLinkDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createShareLink(createShareLinkDTO, userId);
  }

  @Post('delete-share-link')
  @ApiOperation({
    summary: 'Delete a share link',
    description: 'Delete a share link for a mini blog',
  })
  @HttpCode(200)
  async deleteShareLink(@Body() deleteShareLinkDTO: DeleteShareLinkDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deleteShareLink(deleteShareLinkDTO, userId);
  }

  @Post('delete-with-shares')
  @ApiOperation({
    summary: 'Delete a mini blog with all its shares',
    description: 'Delete a mini blog and all associated share links',
  })
  @HttpCode(200)
  async deleteWithShares(@Body() deleteMiniBlogDTO: DeleteMiniBlogDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deleteWithShares(deleteMiniBlogDTO, userId);
  }
}
