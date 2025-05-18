import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRelaService } from '../services/user-rela.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { FollowUserDto } from '../dto/follow-user.dto';
import { GetFollowersDto } from '../dto/get-followers.dto';
import { GetFollowingDto } from '../dto/get-following.dto';
import { CheckFollowStatusDto } from '../dto/check-follow-status.dto';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('User Relationships')
@Controller('user-rela')
export class UserRelaController {
  constructor(private readonly service: UserRelaService) {}

  @Post('follow')
  @ApiOperation({ summary: 'Follow a user' })
  async followUser(@Body() dto: FollowUserDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.followUser(dto, userId);
  }

  @Post('unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollowUser(@Body() dto: FollowUserDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.unfollowUser(dto, userId);
  }

  @Post('get-followers')
  @ApiOperation({ summary: 'Get followers list with pagination' })
  async getFollowers(@Body() dto: GetFollowersDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getFollowers(dto, userId);
  }

  @Post('get-following')
  @ApiOperation({ summary: 'Get following list with pagination' })
  async getFollowing(@Body() dto: GetFollowingDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getFollowing(dto, userId);
  }

  @Post('check-follow-status')
  @ApiOperation({ summary: 'Check if user is following another user' })
  async checkFollowStatus(@Body() dto: CheckFollowStatusDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.checkFollowStatus(dto, userId);
  }
}
