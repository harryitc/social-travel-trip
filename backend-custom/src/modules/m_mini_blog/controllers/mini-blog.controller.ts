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
import {
  CreateShareLinkDTO,
  DeleteShareLinkDTO,
  GetSharesListDTO,
  ShareMiniBlogDTO,
  UpdateShareInfoDTO,
} from '../dto/share-mini-blog.dto';
import { UpdateMiniBlogDTO } from '../dto/update-mini-blog.dto';
import {
  CreateMiniBlogCommentDTO,
  ReplyMiniBlogCommentDTO,
} from '../dto/create-mini-blog-comment.dto';
import {
  LikeMiniBlogCommentDTO,
  LikeMiniBlogDTO,
} from '../dto/like-mini-blog.dto';
import {
  GetMiniBlogCommentLikesDTO,
  GetMiniBlogCommentsDTO,
  GetMiniBlogLikesDTO,
} from '../dto/get-mini-blog-comments.dto';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Mini Blog')
@Controller('mini-blog')
export class MiniBlogController {
  constructor(private readonly service: MiniBlogService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new mini blog',
    description:
      'Create a new mini blog with title, description, and other details',
  })
  @HttpCode(201)
  async createMiniBlog(
    @Body() createMiniBlogDTO: CreateMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createMiniBlog(createMiniBlogDTO, +userId);
  }

  @Post('query')
  @ApiOperation({
    summary: 'Get mini blogs with filtering, pagination, and sorting',
    description: 'Get all mini blogs or filter by user, search text, etc.',
  })
  @HttpCode(200)
  async getMiniBlogList(
    @Body() getMiniBlogDTO: GetMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getMiniBlogList(getMiniBlogDTO, +userId);
  }

  @Get('get-by-id')
  @ApiOperation({
    summary: 'Get mini blog by ID',
    description: 'Get details of a specific mini blog by its ID',
  })
  async getMiniBlogById(
    @Query('miniBlogId') miniBlogId: number,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetMiniBlogByIdDTO = { miniBlogId: +miniBlogId };
    return this.service.getMiniBlogById(dto, +userId);
  }

  @Post('update')
  @ApiOperation({
    summary: 'Update a mini blog',
    description: 'Update the content and details of a mini blog',
  })
  @HttpCode(200)
  async updateMiniBlog(
    @Body() updateMiniBlogDTO: UpdateMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateMiniBlog(updateMiniBlogDTO, +userId);
  }

  @Post('delete')
  @ApiOperation({
    summary: 'Delete a mini blog',
    description: 'Delete a mini blog by its ID',
  })
  @HttpCode(200)
  async deleteMiniBlog(
    @Body() deleteMiniBlogDTO: DeleteMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deleteMiniBlog(deleteMiniBlogDTO, +userId);
  }

  @Post('share')
  @ApiOperation({
    summary: 'Share a mini blog',
    description:
      'Share a mini blog on various platforms like Facebook, X, etc.',
  })
  @HttpCode(200)
  async shareMiniBlog(
    @Body() shareMiniBlogDTO: ShareMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.shareMiniBlog(shareMiniBlogDTO, +userId);
  }

  @Post('update-share')
  @ApiOperation({
    summary: 'Update share information',
    description: 'Update the information of a shared mini blog',
  })
  @HttpCode(200)
  async updateShareInfo(
    @Body() updateShareInfoDTO: UpdateShareInfoDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateShareInfo(updateShareInfoDTO, +userId);
  }

  @Get('get-shares')
  @ApiOperation({
    summary: 'Get shares list',
    description: 'Get a list of all shares for a mini blog',
  })
  async getSharesList(
    @Query('miniBlogId') miniBlogId: number,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetSharesListDTO = { miniBlogId: +miniBlogId };
    return this.service.getSharesList(dto, +userId);
  }

  @Post('create-share-link')
  @ApiOperation({
    summary: 'Create a share link',
    description: 'Create a custom share link for a mini blog',
  })
  @HttpCode(201)
  async createShareLink(
    @Body() createShareLinkDTO: CreateShareLinkDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createShareLink(createShareLinkDTO, +userId);
  }

  @Post('delete-share-link')
  @ApiOperation({
    summary: 'Delete a share link',
    description: 'Delete a share link for a mini blog',
  })
  @HttpCode(200)
  async deleteShareLink(
    @Body() deleteShareLinkDTO: DeleteShareLinkDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deleteShareLink(deleteShareLinkDTO, +userId);
  }

  @Post('delete-with-shares')
  @ApiOperation({
    summary: 'Delete a mini blog with all its shares',
    description: 'Delete a mini blog and all associated share links',
  })
  @HttpCode(200)
  async deleteWithShares(
    @Body() deleteMiniBlogDTO: DeleteMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deleteWithShares(deleteMiniBlogDTO, +userId);
  }

  // Comment endpoints
  @Post('comment/create')
  @ApiOperation({
    summary: 'Create a comment on a mini blog',
    description: 'Add a comment to a mini blog or reply to another comment',
  })
  @HttpCode(201)
  async createComment(
    @Body() createMiniBlogCommentDTO: CreateMiniBlogCommentDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createComment(createMiniBlogCommentDTO, +userId);
  }

  @Post('comment/reply')
  @ApiOperation({
    summary: 'Reply to a comment on a mini blog',
    description: 'Add a reply to an existing comment on a mini blog',
  })
  @HttpCode(201)
  async replyComment(
    @Body() replyMiniBlogCommentDTO: ReplyMiniBlogCommentDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.replyComment(replyMiniBlogCommentDTO, +userId);
  }

  @Get('comments')
  @ApiOperation({
    summary: 'Get comments for a mini blog',
    description: 'Get all comments for a mini blog, including replies',
  })
  async getComments(
    @Query('miniBlogId') miniBlogId: number,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetMiniBlogCommentsDTO = { miniBlogId: +miniBlogId };
    return this.service.getCommentsByMiniBlogId(dto, +userId);
  }

  // Like endpoints
  @Post('like')
  @ApiOperation({
    summary: 'Like a mini blog',
    description: 'Add a like or reaction to a mini blog',
  })
  @HttpCode(200)
  async likeMiniBlog(
    @Body() likeMiniBlogDTO: LikeMiniBlogDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.likeMiniBlog(likeMiniBlogDTO, +userId);
  }

  @Post('comment/like')
  @ApiOperation({
    summary: 'Like a comment on a mini blog',
    description: 'Add a like or reaction to a comment on a mini blog',
  })
  @HttpCode(200)
  async likeComment(
    @Body() likeMiniBlogCommentDTO: LikeMiniBlogCommentDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.likeComment(likeMiniBlogCommentDTO, +userId);
  }

  @Get('likes')
  @ApiOperation({
    summary: 'Get likes for a mini blog',
    description: 'Get all likes and reactions for a mini blog',
  })
  async getLikes(@Query('miniBlogId') miniBlogId: number, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetMiniBlogLikesDTO = { miniBlogId: +miniBlogId };
    return this.service.getLikesByMiniBlogId(dto, +userId);
  }

  @Get('comment/likes')
  @ApiOperation({
    summary: 'Get likes for a comment on a mini blog',
    description: 'Get all likes and reactions for a comment on a mini blog',
  })
  async getCommentLikes(
    @Query('commentId') commentId: number,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    const dto: GetMiniBlogCommentLikesDTO = { commentId: +commentId };
    return this.service.getLikesByCommentId(dto, +userId);
  }
}
