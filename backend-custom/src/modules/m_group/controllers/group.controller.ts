import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateGroupDto } from '../dto/create-group.dto';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { GetGroupMembersDto } from '../dto/get-group-members.dto';
import { GetGroupDetailsDto } from '../dto/get-group-details.dto';
import { KickGroupMemberDto } from '../dto/kick-group-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { GroupService } from '../services/group.service';

@ApiTags('Group')
@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @Get('get-list')
  @ApiOperation({ summary: 'Get list groups' })
  async getListGroups(@Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getListGroups(userId);
  }

  @Post('get-details')
  @ApiOperation({ summary: 'Get group details' })
  async getGroupDetails(@Body() dto: GetGroupDetailsDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getGroupDetails(dto, userId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new group' })
  async createGroup(@Body() dto: CreateGroupDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.createGroup(dto, userId);
  }

  @Post('add-member')
  @ApiOperation({ summary: 'Add a member to group' })
  async addMember(@Body() dto: AddGroupMemberDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.addMember(dto, userId);
  }

  @Post('get-members')
  @ApiOperation({ summary: 'Get members of a group with pagination' })
  async getGroupMembers(@Body() dto: GetGroupMembersDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getGroupMembers(dto, userId);
  }

  @Post('kick-member')
  @ApiOperation({ summary: 'Kick a member from group' })
  async kickMember(@Body() dto: KickGroupMemberDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.kickGroupMember(dto, userId);
  }

  @Post('update-member-role')
  @ApiOperation({ summary: 'Update a member role in group' })
  async updateMemberRole(
    @Body() dto: UpdateMemberRoleDto,
    @Request() req: any,
  ) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.updateMemberRole(dto, userId);
  }

  @Post('send-message')
  @ApiOperation({ summary: 'Send a message to group' })
  async sendMessage(@Body() dto: SendMessageDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.sendMessage(dto, userId);
  }

  @Post('get-messages')
  @ApiOperation({ summary: 'Get messages from group with pagination' })
  async getMessages(@Body() dto: GetMessagesDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getMessages(dto, userId);
  }

  @Post('messages/like')
  @ApiOperation({ summary: 'Toggle like on a message' })
  async toggleLike(@Query('messageId') messageId: string, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.toggleLike(+messageId, userId);
  }

  @Post('messages/pin')
  @ApiOperation({ summary: 'Toggle pin on a message' })
  async togglePin(
    @Query('messageId') messageId: string,
    @Body('groupId') groupId: number,
    @Request() req: any,
  ) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.togglePin(+messageId, groupId, userId);
  }

  @Get('groups/get-list-pinned')
  @ApiOperation({ summary: 'Get pinned messages from group' })
  async getPinnedMessages(
    @Query('groupId') groupId: string,
    @Request() req: any,
  ) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.getPinnedMessages(+groupId, userId);
  }

  @Post('groups/update')
  @ApiOperation({ summary: 'Update group information' })
  async updateGroup(@Body() dto: UpdateGroupDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.service.updateGroup(dto, userId);
  }
}
