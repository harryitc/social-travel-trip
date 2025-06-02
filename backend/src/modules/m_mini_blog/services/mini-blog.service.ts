import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMiniBlogDTO } from '../dto/create-mini-blog.dto';
import { DeleteMiniBlogDTO } from '../dto/delete-mini-blog.dto';
import { GetMiniBlogByIdDTO, GetMiniBlogDTO } from '../dto/get-mini-blog.dto';
import { CreateShareLinkDTO, DeleteShareLinkDTO, GetSharesListDTO, ShareMiniBlogDTO, UpdateShareInfoDTO } from '../dto/share-mini-blog.dto';
import { UpdateMiniBlogDTO } from '../dto/update-mini-blog.dto';
import { CreateMiniBlogCommentDTO, ReplyMiniBlogCommentDTO } from '../dto/create-mini-blog-comment.dto';
import { LikeMiniBlogCommentDTO, LikeMiniBlogDTO } from '../dto/like-mini-blog.dto';
import { GetMiniBlogCommentLikesDTO, GetMiniBlogCommentsDTO, GetMiniBlogLikesDTO } from '../dto/get-mini-blog-comments.dto';
import { CreateMiniBlogCommand } from '../commands/create-mini-blog.command';
import { UpdateMiniBlogCommand } from '../commands/update-mini-blog.command';
import { DeleteMiniBlogCommand } from '../commands/delete-mini-blog.command';
import { ShareMiniBlogCommand } from '../commands/share-mini-blog.command';
import { UpdateShareInfoCommand } from '../commands/update-share-info.command';
import { CreateShareLinkCommand } from '../commands/create-share-link.command';
import { DeleteShareLinkCommand } from '../commands/delete-share-link.command';
import { DeleteWithSharesCommand } from '../commands/delete-with-shares.command';
import { CreateMiniBlogCommentCommand } from '../commands/create-mini-blog-comment.command';
import { ReplyMiniBlogCommentCommand } from '../commands/reply-mini-blog-comment.command';
import { LikeMiniBlogCommand } from '../commands/like-mini-blog.command';
import { LikeMiniBlogCommentCommand } from '../commands/like-mini-blog-comment.command';
import { GetMiniBlogsQuery } from '../queries/get-mini-blogs.query';
import { GetMiniBlogByIdQuery } from '../queries/get-mini-blog-by-id.query';
import { GetSharesListQuery } from '../queries/get-shares-list.query';
import { GetMiniBlogCommentsQuery } from '../queries/get-mini-blog-comments.query';
import { GetMiniBlogLikesQuery } from '../queries/get-mini-blog-likes.query';
import { GetMiniBlogCommentLikesQuery } from '../queries/get-mini-blog-comment-likes.query';

@Injectable()
export class MiniBlogService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async createMiniBlog(createMiniBlogDTO: CreateMiniBlogDTO, userId: number) {
    return this.commandBus.execute(
      new CreateMiniBlogCommand(createMiniBlogDTO, userId),
    );
  }

  async getMiniBlogList(getMiniBlogDTO: GetMiniBlogDTO, userId: number) {
    return this.queryBus.execute(new GetMiniBlogsQuery(getMiniBlogDTO, userId));
  }

  async getMiniBlogById(getMiniBlogByIdDTO: GetMiniBlogByIdDTO, userId: number) {
    return this.queryBus.execute(new GetMiniBlogByIdQuery(getMiniBlogByIdDTO, userId));
  }

  async updateMiniBlog(updateMiniBlogDTO: UpdateMiniBlogDTO, userId: number) {
    return this.commandBus.execute(
      new UpdateMiniBlogCommand(updateMiniBlogDTO, userId),
    );
  }

  async deleteMiniBlog(deleteMiniBlogDTO: DeleteMiniBlogDTO, userId: number) {
    return this.commandBus.execute(
      new DeleteMiniBlogCommand(deleteMiniBlogDTO, userId),
    );
  }

  async shareMiniBlog(shareMiniBlogDTO: ShareMiniBlogDTO, userId: number) {
    return this.commandBus.execute(
      new ShareMiniBlogCommand(shareMiniBlogDTO, userId),
    );
  }

  async updateShareInfo(updateShareInfoDTO: UpdateShareInfoDTO, userId: number) {
    return this.commandBus.execute(
      new UpdateShareInfoCommand(updateShareInfoDTO, userId),
    );
  }

  async getSharesList(getSharesListDTO: GetSharesListDTO, userId: number) {
    return this.queryBus.execute(new GetSharesListQuery(getSharesListDTO, userId));
  }

  async createShareLink(createShareLinkDTO: CreateShareLinkDTO, userId: number) {
    return this.commandBus.execute(
      new CreateShareLinkCommand(createShareLinkDTO, userId),
    );
  }

  async deleteShareLink(deleteShareLinkDTO: DeleteShareLinkDTO, userId: number) {
    return this.commandBus.execute(
      new DeleteShareLinkCommand(deleteShareLinkDTO, userId),
    );
  }

  async deleteWithShares(deleteMiniBlogDTO: DeleteMiniBlogDTO, userId: number) {
    return this.commandBus.execute(
      new DeleteWithSharesCommand(deleteMiniBlogDTO, userId),
    );
  }

  // Comment methods
  async createComment(createMiniBlogCommentDTO: CreateMiniBlogCommentDTO, userId: number) {
    return this.commandBus.execute(
      new CreateMiniBlogCommentCommand(createMiniBlogCommentDTO, userId),
    );
  }

  async replyComment(replyMiniBlogCommentDTO: ReplyMiniBlogCommentDTO, userId: number) {
    return this.commandBus.execute(
      new ReplyMiniBlogCommentCommand(replyMiniBlogCommentDTO, userId),
    );
  }

  async getCommentsByMiniBlogId(getMiniBlogCommentsDTO: GetMiniBlogCommentsDTO, userId: number) {
    return this.queryBus.execute(new GetMiniBlogCommentsQuery(getMiniBlogCommentsDTO, userId));
  }

  // Like methods
  async likeMiniBlog(likeMiniBlogDTO: LikeMiniBlogDTO, userId: number) {
    return this.commandBus.execute(
      new LikeMiniBlogCommand(likeMiniBlogDTO, userId),
    );
  }

  async likeComment(likeMiniBlogCommentDTO: LikeMiniBlogCommentDTO, userId: number) {
    return this.commandBus.execute(
      new LikeMiniBlogCommentCommand(likeMiniBlogCommentDTO, userId),
    );
  }

  async getLikesByMiniBlogId(getMiniBlogLikesDTO: GetMiniBlogLikesDTO, userId: number) {
    return this.queryBus.execute(new GetMiniBlogLikesQuery(getMiniBlogLikesDTO, userId));
  }

  async getLikesByCommentId(getMiniBlogCommentLikesDTO: GetMiniBlogCommentLikesDTO, userId: number) {
    return this.queryBus.execute(new GetMiniBlogCommentLikesQuery(getMiniBlogCommentLikesDTO, userId));
  }
}
