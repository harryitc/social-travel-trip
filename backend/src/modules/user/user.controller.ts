import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  RegisterUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  SearchUserDTO,
  DeleteUserDTO,
  GetUserDTO,
} from './dto/user.dto';
import { UpdateProfileStatsDTO } from './dto/profile-stats.dto';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Body() dto: RegisterUserDTO) {
    return this.service.register(dto);
  }

  @Get('details')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user details' })
  async getCurrentUserDetails(@Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.getUserDetails({ user_id: +userId }, +userId);
  }

  @Get('profile-stats')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile statistics' })
  async getProfileStats(@Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.getProfileStats(+userId);
  }

  @Post('details')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user details by criteria' })
  async getUserDetails(@Body() dto: GetUserDTO, @Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.getUserDetails(dto, +userId);
  }

  @Post('update')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user information' })
  async updateUser(@Body() dto: UpdateUserDTO, @Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.updateUser(dto, +userId);
  }

  @Post('change-password')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(@Body() dto: ChangePasswordDTO, @Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.changePassword(dto, +userId);
  }

  @Post('search')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search for users' })
  async searchUsers(@Body() dto: SearchUserDTO, @Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.searchUsers(dto, +userId);
  }

  @Post('delete')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user account' })
  async deleteUser(@Body() dto: DeleteUserDTO, @Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.deleteUser(dto, +userId);
  }

  @Post('update-profile-stats')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile statistics' })
  async updateProfileStats(@Body() dto: UpdateProfileStatsDTO, @Request() req: any) {
    const userId = req['user']?.user_id;
    return this.service.updateProfileStats(dto, +userId);
  }

  @Post('record-profile-view/:profileOwnerId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Record a profile view' })
  async recordProfileView(@Request() req: any, @Body('profileOwnerId') profileOwnerId: number) {
    const viewerId = req['user']?.user_id;
    return this.service.recordProfileView(+viewerId, +profileOwnerId);
  }
}
