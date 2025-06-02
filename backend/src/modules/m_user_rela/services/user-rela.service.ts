import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FollowUserDto } from '../dto/follow-user.dto';
import { GetFollowersDto } from '../dto/get-followers.dto';
import { GetFollowingDto } from '../dto/get-following.dto';
import { CheckFollowStatusDto } from '../dto/check-follow-status.dto';
import { FollowUserCommand } from '../commands/follow-user.command';
import { UnfollowUserCommand } from '../commands/unfollow-user.command';
import { GetFollowersQuery } from '../queries/get-followers.query';
import { GetFollowingQuery } from '../queries/get-following.query';
import { CheckFollowStatusQuery } from '../queries/check-follow-status.query';
import { GetAllFollowersQuery } from '../queries/get-all-followers.query';

@Injectable()
export class UserRelaService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  // Follow a user
  async followUser(dto: FollowUserDto, userId: number) {
    return this.commandBus.execute(new FollowUserCommand(dto, userId));
  }

  // Unfollow a user
  async unfollowUser(dto: FollowUserDto, userId: number) {
    return this.commandBus.execute(new UnfollowUserCommand(dto, userId));
  }

  // Get followers list
  async getFollowers(dto: GetFollowersDto, userId: number) {
    return this.queryBus.execute(new GetFollowersQuery(dto, userId));
  }

  // Get following list
  async getFollowing(dto: GetFollowingDto, userId: number) {
    return this.queryBus.execute(new GetFollowingQuery(dto, userId));
  }

  // Get all followers of a user
  async getAllFollowers(userId: number) {
    return this.queryBus.execute(new GetAllFollowersQuery(userId));
  }

  // Check follow status
  async checkFollowStatus(dto: CheckFollowStatusDto, userId: number) {
    return this.queryBus.execute(new CheckFollowStatusQuery(dto, userId));
  }
}
