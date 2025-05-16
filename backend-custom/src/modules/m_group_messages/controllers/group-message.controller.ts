import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupMessageService } from '../services/group-message.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly service: GroupMessageService) {}
}
