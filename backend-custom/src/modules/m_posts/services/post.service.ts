import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from '../dto/create-post.dto';
import { LikePostDTO } from '../dto/like-post.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LikePostCommand } from '../commands/like-post.command';
import { CreatePostCommand } from '../commands/create-post.command';
import { UpdatePostCommand } from '../commands/update-post.command';
import { GetPostsQuery } from '../queries/get-post.query';
import { GetPostDTO } from '../dto/get-post.dto';
import { GetLikesPostQuery } from '../queries/get-like-post.query';

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

  async getLikes(postId: number, userId: number) {
    return this.queryBus.execute(new GetLikesPostQuery(postId, userId));
  }
}
