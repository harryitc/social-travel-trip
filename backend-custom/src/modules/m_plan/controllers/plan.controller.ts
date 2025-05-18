import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlanService } from '../services/plan.service';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { CreatePlanDTO } from '../dto/create-plan.dto';
import { UpdatePlanDTO } from '../dto/update-plan.dto';
import { UpdatePlanBasicDTO } from '../dto/update-plan-basic.dto';
import { UpdatePlanPlacesDTO } from '../dto/update-plan-places.dto';
import { UpdatePlanSchedulesDTO } from '../dto/update-plan-schedules.dto';
import { CreateDayPlaceDTO } from '../dto/create-day-place.dto';
import { GetPlansDTO } from '../dto/get-plans.dto';
import { GetPlanDetailsDTO } from '../dto/get-plan-details.dto';
import { DeletePlanDTO } from '../dto/delete-plan.dto';
import { AddPlanToGroupDTO } from '../dto/add-plan-to-group.dto';
import { CheckGroupPlanDTO } from '../dto/check-group-plan.dto';
import { GetDayPlacesDTO } from '../dto/get-day-places.dto';
import { CreateScheduleDTO } from '../dto/create-schedule.dto';
import { GetSchedulesDTO } from '../dto/get-schedules.dto';

@ApiBearerAuth('jwt') // ✅ Cho phép truyền JWT token
@UseGuards(JwtAuthGuard) // ✅ Bảo vệ route
@ApiTags('API Plans')
@Controller('plan')
export class PlanController {
  constructor(private readonly service: PlanService) {}

  @Post('query')
  @ApiOperation({
    summary: 'Get plans with filtering, pagination, and sorting',
    description: 'Get all plans or filter by status, search term, or tags',
  })
  @HttpCode(200)
  async getPlans(@Body() dto: GetPlansDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getPlans(dto, userId);
  }

  @Post('details')
  @ApiOperation({
    summary: 'Get plan details',
    description:
      'Get detailed information about a plan including day places and schedules',
  })
  @HttpCode(200)
  async getPlanDetails(@Body() dto: GetPlanDetailsDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getPlanDetails(dto, userId);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new plan',
    description: 'Create a new travel plan with basic information',
  })
  @HttpCode(201)
  async createPlan(@Body() dto: CreatePlanDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createPlan(dto, userId);
  }

  @Post('update')
  @ApiOperation({
    summary: 'Update a plan (legacy)',
    description:
      'Update a plan with new information, day places, or schedules (legacy method)',
  })
  @HttpCode(200)
  async updatePlan(@Body() dto: UpdatePlanDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updatePlan(dto, userId);
  }

  @Post('update-basic')
  @ApiOperation({
    summary: 'Update plan basic information',
    description:
      'Update only the basic information of a plan (name, description, thumbnail, location, status)',
  })
  @HttpCode(200)
  async updatePlanBasic(@Body() dto: UpdatePlanBasicDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updatePlanBasic(dto, userId);
  }

  @Post('update-places')
  @ApiOperation({
    summary: 'Update plan day places',
    description:
      'Update the day places of a plan (add, update, or remove day places)',
  })
  @HttpCode(200)
  async updatePlanPlaces(
    @Body() dto: UpdatePlanPlacesDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updatePlanPlaces(dto, userId);
  }

  @Post('update-schedules')
  @ApiOperation({
    summary: 'Update plan schedules',
    description:
      'Update the schedules of a plan (add, update, or remove schedules for day places)',
  })
  @HttpCode(200)
  async updatePlanSchedules(
    @Body() dto: UpdatePlanSchedulesDTO,
    @Request() req: any,
  ) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.updatePlanSchedules(dto, userId);
  }

  @Post('delete')
  @ApiOperation({
    summary: 'Delete a plan',
    description: 'Delete a plan and all related day places and schedules',
  })
  @HttpCode(200)
  async deletePlan(@Body() dto: DeletePlanDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.deletePlan(dto, userId);
  }

  @Post('add-to-group')
  @ApiOperation({
    summary: 'Add plan to group',
    description: 'Add a plan to a group for group travel',
  })
  @HttpCode(200)
  async addPlanToGroup(@Body() dto: AddPlanToGroupDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.addPlanToGroup(dto, userId);
  }

  @Post('check-group-plan')
  @ApiOperation({
    summary: 'Check if group has a plan',
    description: 'Check if a group already has a travel plan assigned',
  })
  @HttpCode(200)
  async checkGroupPlan(@Body() dto: CheckGroupPlanDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.checkGroupPlan(dto, userId);
  }

  @Post('create-day-place')
  @ApiOperation({
    summary: 'Create a new day place',
    description: 'Create a new day place for a specific day in a plan',
  })
  @HttpCode(201)
  async createDayPlace(@Body() dto: CreateDayPlaceDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createDayPlace(dto, userId);
  }

  @Post('get-day-places')
  @ApiOperation({
    summary: 'Get day places',
    description: 'Get places for a specific day in a plan',
  })
  @HttpCode(200)
  async getDayPlaces(@Body() dto: GetDayPlacesDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getDayPlaces(dto, userId);
  }

  @Post('create-schedule')
  @ApiOperation({
    summary: 'Create a new schedule',
    description: 'Create a new schedule for a specific day place',
  })
  @HttpCode(201)
  async createSchedule(@Body() dto: CreateScheduleDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.createSchedule(dto, userId);
  }

  @Post('get-schedules')
  @ApiOperation({
    summary: 'Get schedules',
    description: 'Get schedules for a specific day place',
  })
  @HttpCode(200)
  async getSchedules(@Body() dto: GetSchedulesDTO, @Request() req: any) {
    const userId = req['user']?.user_id ?? 'test';
    return this.service.getSchedules(dto, userId);
  }
}
