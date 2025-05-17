import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlanService } from '../services/plan.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Plans')
@Controller('plan')
export class PlanController {
  constructor(private readonly service: PlanService) {}
}
