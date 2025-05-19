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
import { CreatePostDTO } from '../dto/create-post.dto';
import { LikePostDTO } from '../dto/like-post.dto';
import { PostService } from '../services/post.service';
import { UpdatePostDTO } from '../dto/update-post.dto';
import { GetPostDTO } from '../dto/get-post.dto';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
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
    return this.service.getPosts(getPostDTO, +requestUID);
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
    return this.service.create(createPostDTO, +userId);
  }

  @Post('like')
  @ApiOperation({
    summary: 'Like or react to a post',
    description: 'Add a like or reaction to a post',
  })
  @HttpCode(200)
  async likePost(@Body() likePostDTO: LikePostDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.like(likePostDTO, +userId);
  }

  @Get('get-post-likes')
  @ApiOperation({
    summary: 'Get post likes',
    description: 'Get all likes and reactions for a post',
  })
  async getPostLikes(@Query('postId') postId: string, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getLikes(+postId, +userId);
  }

  @Post('update')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Cap thong noi dung bai viet',
  })
  @HttpCode(201)
  async updatePost(@Body() updatePostDTO: UpdatePostDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updatePost(updatePostDTO, +userId);
  }
}
