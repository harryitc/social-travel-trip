import { Injectable } from '@nestjs/common';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentByPostQuery } from '../queries/get-comment-by-post-query';
import { CreateCommentCommand } from '../commands/create-comment.command';
import { LikeCommentCommand } from '../commands/like-comment.command';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { GetLikesCommentQuery } from '../queries/get-likes-comment.query';

@Injectable()
export class CommentService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async createComment(createCommentDTO: CreateCommentDTO, userId: number) {
    return this.commandBus.execute(
      new CreateCommentCommand(createCommentDTO, userId),
    );
  }

  async getComments(postId: number, userId: number) {
    return this.queryBus.execute(new GetCommentByPostQuery(postId, userId));
  }

  async likeComment(likeCommentDTO: LikeCommentDTO, userId: number) {
    return this.commandBus.execute(
      new LikeCommentCommand(likeCommentDTO, userId),
    );
  }
  async getLikesComment(commentId: number, userId: number) {
    return this.queryBus.execute(new GetLikesCommentQuery(commentId, userId));
  }
}
