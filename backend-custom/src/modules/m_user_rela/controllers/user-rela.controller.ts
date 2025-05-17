import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRelaService } from '../services/user-rela.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API User Rela')
@Controller('user-rela')
export class UserRelaController {
  constructor(private readonly service: UserRelaService) {}
}
