import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MiniBlogService } from '../services/mini-blog.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Mini Blog')
@Controller('mini-blog')
export class MiniBlogController {
  constructor(private readonly service: MiniBlogService) {}
}
