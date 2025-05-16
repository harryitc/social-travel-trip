import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { NotifyService } from '../services/notify.service';

@ApiTags('Notify')
@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@Controller('Notify')
@UseGuards(JwtAuthGuard)
export class NotifyController {
  constructor(private readonly service: NotifyService) {}
}
