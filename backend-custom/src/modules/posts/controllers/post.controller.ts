import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FilterPostDTO } from '../dto/filter-post.dto';
import { CreatePostDTO } from '../dto/create-post.dto';
import { LikePostDTO } from '../dto/like-post.dto';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { PostService } from '../services/post.service';

@ApiTags('API Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('query')
  @ApiOperation({
    summary: 'Get posts with filtering, pagination, and sorting',
    description:
      'Get all posts or filter by user, category, search text, or followers',
  })
  @HttpCode(200)
  async getPosts(@Body() filterDTO: FilterPostDTO, @Request() req: any) {
    const requestUID = req['user']?.id ?? 'test';
    return this.service.filter(filterDTO, requestUID);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Create a new post with optional media, location, hashtags, and mentions',
  })
  @HttpCode(201)
  async createPost(@Body() createPostDTO: CreatePostDTO, @Request() req: any) {
    const userId = req['user']?.id ?? 'test';
    return this.service.create(createPostDTO, userId);
  }

  @Post('like')
  @ApiOperation({
    summary: 'Like or react to a post',
    description: 'Add a like or reaction to a post',
  })
  @HttpCode(200)
  async likePost(@Body() likePostDTO: LikePostDTO, @Request() req: any) {
    const userId = req['user']?.id ?? 'test';
    return this.service.like(likePostDTO, userId);
  }

  @Get('likes/:postId')
  @ApiOperation({
    summary: 'Get post likes',
    description: 'Get all likes and reactions for a post',
  })
  async getPostLikes(@Param('postId') postId: string) {
    return this.service.getLikes(postId);
  }

  @Post('comments')
  @ApiOperation({
    summary: 'Create a comment',
    description: 'Add a comment to a post or reply to another comment',
  })
  @HttpCode(201)
  async createComment(
    @Body() createCommentDTO: CreateCommentDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.id ?? 'test';
    return this.service.createComment(createCommentDTO, userId);
  }

  @Get('comments/:postId')
  @ApiOperation({
    summary: 'Get post comments',
    description: 'Get all comments for a post, optionally including replies',
  })
  async getPostComments(
    @Param('postId') postId: string,
    @Query('level') level: number = 1,
  ) {
    return this.service.getComments(postId, level);
  }

  @Post('comments/:commentId/like')
  @ApiOperation({
    summary: 'Like a comment',
    description: 'Add a like to a comment',
  })
  @HttpCode(200)
  async likeComment(
    @Param('commentId') commentId: string,
    @Request() req: any,
  ) {
    const userId = req['user']?.id ?? 'test';
    return this.service.likeComment(commentId, userId);
  }

  @Delete('comments/:commentId/unlike')
  @ApiOperation({
    summary: 'Unlike a comment',
    description: 'Remove a like from a comment',
  })
  async unlikeComment(
    @Param('commentId') commentId: string,
    @Request() req: any,
  ) {
    const userId = req['user']?.id ?? 'test';
    return this.service.unlikeComment(commentId, userId);
  }
}
