import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { PoolClient } from 'pg';
import { CreatePlanDTO } from '../dto/create-plan.dto';
import { UpdatePlanDTO } from '../dto/update-plan.dto';
import { GetPlansDTO } from '../dto/get-plans.dto';
import { AddPlanToGroupDTO } from '../dto/add-plan-to-group.dto';
import { removeVietnameseAccents } from '@common/utils/string-utils';

@Injectable()
export class PlanRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  // Get plans with filtering, pagination, and sorting
  async getPlans(dto: GetPlansDTO, userId: number) {
    const { page = 1, limit = 10, status, search, tags } = dto;
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let paramIndex = 1;

    const textSlug = removeVietnameseAccents(search);

    let query = `
      SELECT
        p.*,
        (SELECT COUNT(*) FROM plan_with_group pwg WHERE pwg.plan_id = p.plan_id) as group_count
      FROM plans p
      WHERE 1=1
    `;

    // Add user filter (only show plans created by the user or public plans)
    query += ` AND (p.user_created = $${paramIndex} OR p.status = 'public')`;
    params.push(userId);
    paramIndex++;

    // Add status filter if provided
    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Add search filter if provided
    if (textSlug) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.json_data->>'name_khong_dau' ILIKE $${paramIndex})`;
      params.push(`%${textSlug}%`);
      paramIndex++;
    }

    // Add tags filter if provided
    if (tags && tags.length > 0) {
      const tagConditions = tags.map((_, idx) => {
        const currentIndex = paramIndex + idx;
        return `p.json_data->'tags' ? $${currentIndex}`;
      });
      query += ` AND (${tagConditions.join(' OR ')})`;
      params.push(...tags);
      paramIndex += tags.length;
    }

    // Add order by and pagination
    query += `
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    return this.client.execute(query, params);
  }

  // Get count of plans with the same filters
  async getPlansCount(dto: GetPlansDTO, userId: number) {
    const { status, search, tags } = dto;
    const params: any[] = [];
    let paramIndex = 1;

    const textSlug = removeVietnameseAccents(search);

    let query = `
      SELECT COUNT(*)
      FROM plans p
      WHERE 1=1
    `;

    // Add user filter (only show plans created by the user or public plans)
    query += ` AND (p.user_created = $${paramIndex} OR p.status = 'public')`;
    params.push(userId);
    paramIndex++;

    // Add status filter if provided
    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Add search filter if provided
    if (textSlug) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.json_data->>'name_khong_dau' ILIKE $${paramIndex})`;
      params.push(`%${textSlug}%`);
      paramIndex++;
    }

    // Add tags filter if provided
    if (tags && tags.length > 0) {
      const tagConditions = tags.map((_, idx) => {
        const currentIndex = paramIndex + idx;
        return `p.json_data->'tags' ? $${currentIndex}`;
      });
      query += ` AND (${tagConditions.join(' OR ')})`;
      params.push(...tags);
    }

    return this.client.execute(query, params);
  }

  // Get plan details by ID
  async getPlanById(planId: number) {
    const query = `
      SELECT
        p.*,
        (SELECT COUNT(*) FROM plan_with_group pwg WHERE pwg.plan_id = p.plan_id) as group_count
      FROM plans p
      WHERE p.plan_id = $1
    `;
    return this.client.execute(query, [planId]);
  }

  // Get day places for a plan
  async getPlanDayPlaces(planId: number) {
    const query = `
      SELECT *
      FROM plan_day_places
      WHERE plan_id = $1
      ORDER BY ngay ASC
    `;
    return this.client.execute(query, [planId]);
  }

  // Get day places for a specific day
  async getDayPlaces(planId: number, day: string) {
    const query = `
      SELECT *
      FROM plan_day_places
      WHERE plan_id = $1 AND ngay = $2
    `;
    return this.client.execute(query, [planId, day]);
  }

  // Get schedules for a day place
  async getPlanSchedules(planDayPlaceId: number) {
    const query = `
      SELECT *
      FROM plan_schedules
      WHERE plan_day_place_id = $1
      ORDER BY start_time ASC
    `;
    return this.client.execute(query, [planDayPlaceId]);
  }

  // Create a new plan
  async createPlan(data: CreatePlanDTO, userId: number) {
    const {
      name,
      description,
      thumbnail_url,
      location,
      status = 'private',
      json_data = {},
    } = data;

    // Add name_khong_dau to json_data if not provided
    if (!json_data.name_khong_dau) {
      json_data.name_khong_dau = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    const params = [
      name,
      description || null,
      thumbnail_url || null,
      JSON.stringify(json_data),
      JSON.stringify(location),
      status,
      userId,
    ];

    const query = `
      INSERT INTO plans (
        name, description, thumbnail_url, json_data, location, status, user_created, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  // Create plan with transaction (plan, day places, schedules)
  async createPlanWithTransaction(data: CreatePlanDTO, userId: number) {
    return this.client.transaction(async (client: PoolClient) => {
      // Create the plan
      const {
        name,
        description,
        thumbnail_url,
        location,
        status = 'private',
        json_data = {},
        days,
      } = data;

      // Add name_khong_dau to json_data if not provided
      if (!json_data.name_khong_dau) {
        json_data.name_khong_dau = removeVietnameseAccents(name);
      }

      const planParams = [
        name,
        description || null,
        thumbnail_url || null,
        JSON.stringify(json_data),
        JSON.stringify(location),
        status,
        userId,
      ];

      const planQuery = `
        INSERT INTO plans (
          name, description, thumbnail_url, json_data, location, status, user_created, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;

      const planResult = await client.query(planQuery, planParams);
      const plan = planResult.rows[0];

      // Create day places for each day
      for (let i = 1; i <= days; i++) {
        const dayPlaceParams = [
          i.toString(),
          JSON.stringify({}),
          JSON.stringify(location), // Initially use the same location as the plan
          plan.plan_id,
        ];

        const dayPlaceQuery = `
          INSERT INTO plan_day_places (
            ngay, json_data, location, plan_id
          )
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;

        await client.query(dayPlaceQuery, dayPlaceParams);
      }

      return plan;
    });
  }

  // Update plan
  async updatePlan(data: UpdatePlanDTO) {
    const { plan_id, name, description, thumbnail_url, location, status } =
      data;
    const params: any[] = [];
    const updateFields: string[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;

      updateFields.push(`json_data->>'name_khong_dau' = $${paramIndex}`);
      params.push(removeVietnameseAccents(name));
      paramIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (thumbnail_url !== undefined) {
      updateFields.push(`thumbnail_url = $${paramIndex}`);
      params.push(thumbnail_url);
      paramIndex++;
    }

    if (location !== undefined) {
      updateFields.push(`location = $${paramIndex}`);
      params.push(JSON.stringify(location));
      paramIndex++;
    }

    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);

    // If no fields to update, return early
    if (updateFields.length === 1) {
      return { rowCount: 0, rows: [] };
    }

    params.push(plan_id);
    const query = `
      UPDATE plans
      SET ${updateFields.join(', ')}
      WHERE plan_id = $${paramIndex}
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  // Update plan with transaction (plan, day places, schedules)
  async updatePlanWithTransaction(data: UpdatePlanDTO) {
    return this.client.transaction(async (client: PoolClient) => {
      const {
        plan_id,
        name,
        description,
        thumbnail_url,
        location,
        status,
        day_places,
        schedules,
      } = data;

      // Update plan basic info if provided
      if (name || description || thumbnail_url || location || status) {
        const params: any[] = [];
        const updateFields: string[] = [];
        let paramIndex = 1;

        if (name !== undefined) {
          updateFields.push(`name = $${paramIndex}`);
          params.push(name);
          paramIndex++;

          updateFields.push(`json_data->>'name_khong_dau' = $${paramIndex}`);
          params.push(removeVietnameseAccents(name));
          paramIndex++;
        }

        if (description !== undefined) {
          updateFields.push(`description = $${paramIndex}`);
          params.push(description);
          paramIndex++;
        }

        if (thumbnail_url !== undefined) {
          updateFields.push(`thumbnail_url = $${paramIndex}`);
          params.push(thumbnail_url);
          paramIndex++;
        }

        if (location !== undefined) {
          updateFields.push(`location = $${paramIndex}`);
          params.push(JSON.stringify(location));
          paramIndex++;
        }

        if (status !== undefined) {
          updateFields.push(`status = $${paramIndex}`);
          params.push(status);
          paramIndex++;
        }

        updateFields.push(`updated_at = NOW()`);
        params.push(plan_id);

        const planQuery = `
          UPDATE plans
          SET ${updateFields.join(', ')}
          WHERE plan_id = $${paramIndex}
          RETURNING *
        `;

        await client.query(planQuery, params);
      }

      // Update day places if provided
      if (day_places && day_places.length > 0) {
        for (const dayPlace of day_places) {
          if (dayPlace.plan_day_place_id) {
            // Update existing day place
            const dayPlaceParams = [
              dayPlace.ngay,
              JSON.stringify(dayPlace.json_data || {}),
              JSON.stringify(dayPlace.location),
              dayPlace.plan_day_place_id,
            ];

            const dayPlaceQuery = `
              UPDATE plan_day_places
              SET ngay = $1, json_data = $2, location = $3
              WHERE plan_day_place_id = $4
              RETURNING *
            `;

            await client.query(dayPlaceQuery, dayPlaceParams);
          } else {
            // Create new day place
            const dayPlaceParams = [
              dayPlace.ngay,
              JSON.stringify(dayPlace.json_data || {}),
              JSON.stringify(dayPlace.location),
              plan_id,
            ];

            const dayPlaceQuery = `
              INSERT INTO plan_day_places (
                ngay, json_data, location, plan_id
              )
              VALUES ($1, $2, $3, $4)
              RETURNING *
            `;

            await client.query(dayPlaceQuery, dayPlaceParams);
          }
        }
      }

      // Update schedules if provided
      if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
          if (schedule.plan_schedule_id) {
            // Update existing schedule
            const scheduleParams = [
              schedule.name,
              schedule.description || null,
              schedule.start_time || null,
              schedule.end_time || null,
              JSON.stringify(schedule.location),
              JSON.stringify(schedule.json_data || {}),
              schedule.activity_id || null,
              schedule.plan_schedule_id,
            ];

            const scheduleQuery = `
              UPDATE plan_schedules
              SET name = $1, description = $2, start_time = $3, end_time = $4,
                  location = $5, json_data = $6, activity_id = $7, updated_at = NOW()
              WHERE plan_schedule_id = $8
              RETURNING *
            `;

            await client.query(scheduleQuery, scheduleParams);
          } else {
            // Create new schedule
            const scheduleParams = [
              schedule.name,
              schedule.description || null,
              schedule.start_time || null,
              schedule.end_time || null,
              JSON.stringify(schedule.location),
              JSON.stringify(schedule.json_data || {}),
              schedule.activity_id || null,
              schedule.plan_day_place_id,
            ];

            const scheduleQuery = `
              INSERT INTO plan_schedules (
                name, description, start_time, end_time, location, json_data,
                activity_id, plan_day_place_id, created_at, updated_at
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
              RETURNING *
            `;

            await client.query(scheduleQuery, scheduleParams);
          }
        }
      }

      // Return the updated plan
      const planQuery = `
        SELECT
          p.*,
          (SELECT COUNT(*) FROM plan_with_group pwg WHERE pwg.plan_id = p.plan_id) as group_count
        FROM plans p
        WHERE p.plan_id = $1
      `;
      const planResult = await client.query(planQuery, [plan_id]);
      return planResult.rows[0];
    });
  }

  // Delete plan
  async deletePlan(planId: number) {
    return this.client.transaction(async (client: PoolClient) => {
      // First delete all schedules related to the plan's day places
      const deleteSchedulesQuery = `
        DELETE FROM plan_schedules
        WHERE plan_day_place_id IN (
          SELECT plan_day_place_id FROM plan_day_places WHERE plan_id = $1
        )
      `;
      await client.query(deleteSchedulesQuery, [planId]);

      // Delete all day places
      const deleteDayPlacesQuery = `
        DELETE FROM plan_day_places
        WHERE plan_id = $1
      `;
      await client.query(deleteDayPlacesQuery, [planId]);

      // Delete plan-group associations
      const deletePlanGroupQuery = `
        DELETE FROM plan_with_group
        WHERE plan_id = $1
      `;
      await client.query(deletePlanGroupQuery, [planId]);

      // Finally delete the plan
      const deletePlanQuery = `
        DELETE FROM plans
        WHERE plan_id = $1
        RETURNING *
      `;
      const result = await client.query(deletePlanQuery, [planId]);
      return result.rows[0];
    });
  }

  // Add plan to group
  async addPlanToGroup(data: AddPlanToGroupDTO, userId: number) {
    const { plan_id, group_id } = data;
    const params = [plan_id, group_id, userId];

    const query = `
      INSERT INTO plan_with_group (
        plan_id, group_id, user_created, created_at, updated_at
      )
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (plan_id, group_id) DO NOTHING
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  // Check if group has a plan
  async checkGroupPlan(groupId: number) {
    const query = `
      SELECT p.*
      FROM plans p
      JOIN plan_with_group pwg ON p.plan_id = pwg.plan_id
      WHERE pwg.group_id = $1
    `;
    return this.client.execute(query, [groupId]);
  }

  // Get day place by ID
  async getDayPlaceById(dayPlaceId: number) {
    const query = `
      SELECT *
      FROM plan_day_places
      WHERE plan_day_place_id = $1
    `;
    return this.client.execute(query, [dayPlaceId]);
  }

  // Create a new schedule
  async createSchedule(data: any) {
    const {
      name,
      description,
      start_time,
      end_time,
      location,
      json_data = {},
      activity_id,
      plan_day_place_id,
    } = data;

    const params = [
      name,
      description || null,
      start_time || null,
      end_time || null,
      JSON.stringify(location),
      JSON.stringify(json_data),
      activity_id || null,
      plan_day_place_id,
    ];

    const query = `
      INSERT INTO plan_schedules (
        name, description, start_time, end_time, location, json_data,
        activity_id, plan_day_place_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  // Get schedules for a day place with pagination
  async getSchedules(dto: any) {
    const { plan_day_place_id, page = 1, limit = 10 } = dto;
    const offset = (page - 1) * limit;
    const params = [plan_day_place_id, limit, offset];

    const query = `
      SELECT *
      FROM plan_schedules
      WHERE plan_day_place_id = $1
      ORDER BY start_time ASC
      LIMIT $2 OFFSET $3
    `;

    return this.client.execute(query, params);
  }

  // Get count of schedules for a day place
  async getSchedulesCount(dayPlaceId: number) {
    const query = `
      SELECT COUNT(*)
      FROM plan_schedules
      WHERE plan_day_place_id = $1
    `;
    return this.client.execute(query, [dayPlaceId]);
  }
}
