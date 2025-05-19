import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { NotifyService } from '../services/notify.service';
import { CreateNotifyDto } from '../dto/create-notify.dto';
import { UpdateNotifyDto } from '../dto/update-notify.dto';
import { DeleteNotifyDto } from '../dto/delete-notify.dto';
import { GetNotifyDto } from '../dto/get-notify.dto';
import { FilterNotifyDto } from '../dto/filter-notify.dto';
import { MarkReadNotifyDto } from '../dto/mark-read-notify.dto';

@ApiTags('Notify')
@ApiBearerAuth('jwt')
@Controller('notify')
@UseGuards(JwtAuthGuard)
export class NotifyController {
  constructor(private readonly service: NotifyService) {}

  @Post('create')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new notification',
    description: 'Creates a new notification with the provided data',
  })
  createNotification(@Body() dto: CreateNotifyDto, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.service.createNotification(dto, +userId);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update a notification',
    description: 'Updates an existing notification with the provided data',
  })
  updateNotification(@Body() dto: UpdateNotifyDto, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.service.updateNotification(dto, +userId);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete a notification',
    description: 'Deletes a notification by ID',
  })
  deleteNotification(@Body() dto: DeleteNotifyDto, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.service.deleteNotification(dto, +userId);
  }

  @Post('mark-read')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Mark a notification as read',
    description: 'Marks a notification as read by ID',
  })
  markNotificationAsRead(@Body() dto: MarkReadNotifyDto, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.service.markNotificationAsRead(dto, +userId);
  }

  @Post('get')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a notification by ID',
    description: 'Retrieves a notification by ID',
  })
  getNotification(@Body() dto: GetNotifyDto, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.service.getNotification(dto, +userId);
  }

  @Post('query')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get notifications with filtering',
    description:
      'Retrieves notifications with filtering, pagination, and sorting',
  })
  getNotifications(@Body() dto: FilterNotifyDto, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.service.getNotifications(dto, +userId);
  }
}
