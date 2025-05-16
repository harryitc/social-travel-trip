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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateGroupCommand } from '../commands/create-group.command';
import { AddGroupMemberCommand } from '../commands/add-group-member.command';
import { SendMessageCommand } from '../commands/send-message.command';
import { ToggleMessageLikeCommand } from '../commands/toggle-message-like.command';
import { ToggleMessagePinCommand } from '../commands/toggle-message-pin.command';
import { GetMessagesQuery } from '../queries/get-messages.query';
import { GetPinnedMessagesQuery } from '../queries/get-pinned-messages.query';
import { CreateGroupDto } from '../dto/create-group.dto';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { ToggleMessagePinDto } from '../dto/toggle-message-pin.dto';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiTags('Group')
@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('groups')
  @ApiOperation({ summary: 'Create a new group' })
  async createGroup(@Body() dto: CreateGroupDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.commandBus.execute(new CreateGroupCommand(dto, userId));
  }

  @Post('groups/members')
  @ApiOperation({ summary: 'Add a member to group' })
  async addMember(@Body() dto: AddGroupMemberDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.commandBus.execute(new AddGroupMemberCommand(dto, userId));
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message to group' })
  async sendMessage(@Body() dto: SendMessageDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.commandBus.execute(new SendMessageCommand(dto, userId));
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get messages from group with pagination' })
  async getMessages(@Query() dto: GetMessagesDto, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.queryBus.execute(new GetMessagesQuery(dto, userId));
  }

  @Post('messages/:messageId/like')
  @ApiOperation({ summary: 'Toggle like on a message' })
  async toggleLike(@Param('messageId') messageId: number, @Request() req: any) {
    const userId: number = req['user']?.user_id ?? 'test';
    const dto: ToggleMessageLikeDto = { group_message_id: messageId };
    return this.commandBus.execute(new ToggleMessageLikeCommand(dto, userId));
  }

  @Post('messages/:messageId/pin')
  @ApiOperation({ summary: 'Toggle pin on a message' })
  async togglePin(
    @Param('messageId') messageId: number,
    @Body('groupId') groupId: number,
    @Request() req: any,
  ) {
    const userId: number = req['user']?.user_id ?? 'test';
    const dto: ToggleMessagePinDto = {
      group_message_id: messageId,
      group_id: groupId,
    };
    return this.commandBus.execute(new ToggleMessagePinCommand(dto, userId));
  }

  @Get('groups/:groupId/pinned')
  @ApiOperation({ summary: 'Get pinned messages from group' })
  async getPinnedMessages(
    @Param('groupId') groupId: number,
    @Request() req: any,
  ) {
    const userId: number = req['user']?.user_id ?? 'test';
    return this.queryBus.execute(new GetPinnedMessagesQuery(groupId, userId));
  }
}
