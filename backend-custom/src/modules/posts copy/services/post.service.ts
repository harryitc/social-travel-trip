import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from '../dto/create-post.dto';
import { LikePostDTO } from '../dto/like-post.dto';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentByPostQuery } from '../queries/get-comment-by-post-query';
import { CreateCommentCommand } from '../commands/create-comment.command';
import { LikePostCommand } from '../commands/like-post.command';
import { CreatePostCommand } from '../commands/create-post.command';
import { UpdatePostCommand } from '../commands/update-post.command';
import { LikeCommentCommand } from '../commands/like-comment.command';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { GetPostsQuery } from '../queries/get-post.query';
import { GetPostDTO } from '../dto/get-post.dto';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async updatePost(updatePostDTO: UpdatePostDTO, userId: any) {
    return this.commandBus.execute(
      new UpdatePostCommand(updatePostDTO, userId),
    );
  }
  async getPosts(getPostDTO: GetPostDTO, userId: number) {
    return this.queryBus.execute(new GetPostsQuery(getPostDTO, userId));
  }

  async create(createPostDTO: CreatePostDTO, userId: number) {
    // const createDTO = Post.create(createPostDTO);
    return this.commandBus.execute(
      new CreatePostCommand(createPostDTO, userId),
    );
  }

  async like(likePostDTO: LikePostDTO, userId: number) {
    return this.commandBus.execute(new LikePostCommand(likePostDTO, userId));
  }

  async getLikes(postId: number) {
    // return this.queryBus.execute(new GetLikesQuery(postId));
  }

  async createComment(createCommentDTO: CreateCommentDTO, userId: number) {
    return this.commandBus.execute(
      new CreateCommentCommand(createCommentDTO, userId),
    );
  }

  async getComments(postId: number, userId: number) {
    return this.queryBus.execute(new GetCommentByPostQuery(postId));
  }

  async likeComment(likeCommentDTO: LikeCommentDTO, userId: number) {
    return this.queryBus.execute(
      new LikeCommentCommand(likeCommentDTO, userId),
    );
  }
}
