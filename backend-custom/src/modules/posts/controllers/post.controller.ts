import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePostDTO } from '../dto/create-post.dto';
import { LikePostDTO } from '../dto/like-post.dto';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { PostService } from '../services/post.service';
import { UpdatePostDTO } from '../dto/update-post.dto';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { GetPostDTO } from '../dto/get-post.dto';

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
  async getPosts(@Body() getPostDTO: GetPostDTO, @Request() req: any) {
    const requestUID = req['user']?.user_id ?? 'test';
    return this.service.getPosts(getPostDTO, requestUID);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Create a new post with optional media, location, hashtags, and mentions',
  })
  @HttpCode(201)
  async createPost(@Body() createPostDTO: CreatePostDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.create(createPostDTO, userId);
  }

  @Post('like')
  @ApiOperation({
    summary: 'Like or react to a post',
    description: 'Add a like or reaction to a post',
  })
  @HttpCode(200)
  async likePost(@Body() likePostDTO: LikePostDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.like(likePostDTO, userId);
  }

  @Get('likes')
  @ApiOperation({
    summary: 'Get post likes',
    description: 'Get all likes and reactions for a post',
  })
  async getPostLikes(@Query('postId') postId: number) {
    return this.service.getLikes(postId);
  }

  @Post('posts')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Cap thong noi dung bai viet',
  })
  @HttpCode(201)
  async updatePost(@Body() updatePostDTO: UpdatePostDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updatePost(updatePostDTO, userId);
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
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createComment(createCommentDTO, userId);
  }

  @Get('comments')
  @ApiOperation({
    summary: 'Get post comments',
    description: 'Get all comments for a post, optionally including replies',
  })
  async getPostComments(@Query('postId') postId: number, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getComments(postId, userId);
  }

  @Post('comment/like')
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
    return this.service.likeComment(likeCommentDTO, userId);
  }
}
