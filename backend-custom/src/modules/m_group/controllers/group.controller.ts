import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
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
import { UpdateMemberNicknameDto } from '../dto/update-member-nickname.dto';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { AddMessagePinDto } from '../dto/add-message-pin.dto';
import { RemoveMessagePinDto } from '../dto/remove-message-pin.dto';
import { GetMessageReactionsDto } from '../dto/get-message-reactions.dto';
import { GetPinnedMessagesDto } from '../dto/get-pinned-messages.dto';
import { GenerateJoinQRCodeDto } from '../dto/generate-join-qrcode.dto';
import { JoinGroupByCodeDto } from '../dto/join-group-by-code.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
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
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getListGroups(+userId);
  }

  @Post('get-details')
  @ApiOperation({ summary: 'Get group details' })
  async getGroupDetails(@Body() dto: GetGroupDetailsDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getGroupDetails(dto, +userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update group information' })
  async updateGroup(@Body() dto: UpdateGroupDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateGroup(dto, +userId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new group' })
  async createGroup(@Body() dto: CreateGroupDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createGroup(dto, +userId);
  }

  @Post('add-member')
  @ApiOperation({ summary: 'Add a member to group' })
  async addMember(@Body() dto: AddGroupMemberDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.addMember(dto, +userId);
  }

  @Post('get-members')
  @ApiOperation({ summary: 'Get members of a group with pagination' })
  async getGroupMembers(@Body() dto: GetGroupMembersDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getGroupMembers(dto, +userId);
  }

  @Post('kick-member')
  @ApiOperation({ summary: 'Kick a member from group' })
  async kickMember(@Body() dto: KickGroupMemberDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.kickGroupMember(dto, +userId);
  }

  @Post('update-member-role')
  @ApiOperation({ summary: 'Update a member role in group' })
  async updateMemberRole(
    @Body() dto: UpdateMemberRoleDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateMemberRole(dto, +userId);
  }

  @Post('update-member-nickname')
  @ApiOperation({ summary: 'Update a member nickname in group' })
  async updateMemberNickname(
    @Body() dto: UpdateMemberNicknameDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updateMemberNickname(dto, +userId);
  }

  @Post('send-message')
  @ApiOperation({ summary: 'Send a message to group' })
  async sendMessage(@Body() dto: SendMessageDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.sendMessage(dto, +userId);
  }

  @Post('get-messages')
  @ApiOperation({ summary: 'Get messages from group with pagination' })
  async getMessages(@Body() dto: GetMessagesDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getMessages(dto, +userId);
  }

  @Post('messages/like')
  @ApiOperation({ summary: 'Toggle like on a message' })
  async toggleLike(@Body() dto: ToggleMessageLikeDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.toggleLike(dto, +userId);
  }

  @Post('messages/add-pin')
  @ApiOperation({ summary: 'Add pin to a message' })
  async addMessagePin(@Body() dto: AddMessagePinDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.addMessagePin(dto, +userId);
  }

  @Post('messages/remove-pin')
  @ApiOperation({ summary: 'Remove pin from a message' })
  async removeMessagePin(
    @Body() dto: RemoveMessagePinDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.removeMessagePin(dto, +userId);
  }

  @Post('messages/get-reactions')
  @ApiOperation({ summary: 'Get reactions for a message' })
  async getMessageReactions(
    @Body() dto: GetMessageReactionsDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getMessageReactions(dto, +userId);
  }

  @Post('messages/get-pinned')
  @ApiOperation({ summary: 'Get pinned messages from group' })
  async getPinnedMessages(
    @Body() dto: GetPinnedMessagesDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getPinnedMessages(dto.group_id, +userId);
  }

  @Post('generate-join-qrcode')
  @ApiOperation({ summary: 'Generate QR code for joining a group' })
  async generateJoinQRCode(
    @Body() dto: GenerateJoinQRCodeDto,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.generateJoinQRCode(dto, +userId);
  }

  @Post('join-by-code')
  @ApiOperation({ summary: 'Join a group using a join code from QR code' })
  async joinGroupByCode(@Body() dto: JoinGroupByCodeDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.joinGroupByCode(dto, +userId);
  }

  @Post('invite-member')
  @ApiOperation({ summary: 'Invite a member to group by username or email' })
  async inviteMember(@Body() dto: InviteMemberDto, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.inviteMember(dto, +userId);
  }
}
