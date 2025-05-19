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
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a comment',
    description: 'Add a comment to a post or reply to another comment',
  })
  @HttpCode(201)
  async createComment(
    @Body() createCommentDTO: CreateCommentDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createComment(createCommentDTO, +userId);
  }

  @Get('get')
  @ApiOperation({
    summary: 'Get post comments',
    description: 'Get all comments for a post, optionally including replies',
  })
  async getPostComments(@Query('postId') postId: string, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getComments(+postId, +userId);
  }

  @Post('like')
  @ApiOperation({
    summary: 'Like a comment',
    description: 'Add a like to a comment',
  })
  @HttpCode(200)
  async likeComment(
    @Body() likeCommentDTO: LikeCommentDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.likeComment(likeCommentDTO, +userId);
  }

  @Get('get-likes')
  @ApiOperation({
    summary: 'Get likes comment',
    description: 'Get all likes for a comment',
  })
  async getLikesComment(
    @Query('commentId') commentId: string,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getLikesComment(+commentId, +userId);
  }
}
