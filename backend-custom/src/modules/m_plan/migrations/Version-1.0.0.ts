/**
 * @description Chi tiết về các bảng
 * 1 Kế hoạch (plans) thì có nhiều ngày (plan_day_places). Mỗi ngày sẽ có nhiều địa điểm (plan_day_places - location). Với mỗi địa điểm thì có nhiều lịch trình (plan_schedules).
 */
module.exports = async (client, schema) => {
  /**
   * Bảng plans: kế hoạch đi du lịch
   * json_data: name_khong_dau, tags (danh sách slug name hashtags).
   * location: name, description, lat, lon.
   * status: public | private (default)
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plans" (
    "plan_id" bigserial PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "thumbnail_url" varchar(255),
    "json_data" jsonb,
    "location" jsonb,
    "status" varchar(255),
    "user_created" int8,
    "created_at" timestamp(6),
    "updated_at" timestamp(6)
    );`);

  /**
   * Bảng plan_day_places: Mỗi ngày sẽ có rất nhiều địa điểm
   * ngay: 1, 2, 3, 4, 5, ... (ngày)
   * location: name, description, lat, lon.
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plan_day_places" (
      "plan_day_place_id" bigserial PRIMARY KEY,
      "ngay" varchar(32),
      "json_data" jsonb, 
      "location" jsonb,
      "plan_id" int8
    );`);

  /**
   * Bảng plan_schedules: Danh sách các nơi sẽ đi du lịch trong 1 địa điểm
   * location: name, description, lat, lon.
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plan_schedules" (
    "plan_schedule_id" bigserial PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "start_time" timestamp(6),
    "end_time" timestamp(6),
    "location" jsonb,
    "json_data" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "activity_id" int 8,
    "plan_day_place_id" int8
  );`);

  /**
   * Bảng plan_with_group: Nhóm nào đang sử dụng kế hoạch
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plan_with_group" (
    "plan_with_group_id" bigserial PRIMARY KEY,
    "plan_id" int8,
    "group_id" int8,
    "user_created" int8,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    UNIQUE (plan_id, group_id)
  );`);
};
