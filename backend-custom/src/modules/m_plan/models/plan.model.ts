export class Plan {
  plan_id: number;
  name: string;
  description: string;
  thumbnail_url: string;
  json_data: any; // Contains name_khong_dau, tags
  location: any; // Contains name, description, lat, lon
  status: string; // 'public' | 'private'
  user_created: number;
  created_at: Date;
  updated_at: Date;
  group_count?: number;

  constructor(data: any) {
    this.plan_id = data.plan_id;
    this.name = data.name;
    this.description = data.description;
    this.thumbnail_url = data.thumbnail_url;

    // Parse JSON fields if they are strings
    if (typeof data.json_data === 'string') {
      try {
        this.json_data = JSON.parse(data.json_data);
      } catch (e) {
        this.json_data = data.json_data || {};
      }
    } else {
      this.json_data = data.json_data || {};
    }

    // Parse location if it's a string
    if (typeof data.location === 'string') {
      try {
        this.location = JSON.parse(data.location);
      } catch (e) {
        this.location = data.location || {};
      }
    } else {
      this.location = data.location || {};
    }

    this.status = data.status;
    this.user_created = data.user_created;
    this.created_at = data.created_at ? new Date(data.created_at) : null;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
    this.group_count = data.group_count;
  }
}

export class PlanDayPlace {
  plan_day_place_id: number;
  ngay: string; // Day number as string: '1', '2', etc.
  json_data: any;
  location: any; // Contains name, description, lat, lon
  plan_id: number;

  constructor(data: any) {
    this.plan_day_place_id = data.plan_day_place_id;
    this.ngay = data.ngay;
    this.plan_id = data.plan_id;

    // Parse JSON fields if they are strings
    if (typeof data.json_data === 'string') {
      try {
        this.json_data = JSON.parse(data.json_data);
      } catch (e) {
        this.json_data = data.json_data || {};
      }
    } else {
      this.json_data = data.json_data || {};
    }

    // Parse location if it's a string
    if (typeof data.location === 'string') {
      try {
        this.location = JSON.parse(data.location);
      } catch (e) {
        this.location = data.location || {};
      }
    } else {
      this.location = data.location || {};
    }
  }
}

export class PlanSchedule {
  plan_schedule_id: number;
  name: string;
  description: string;
  start_time: Date;
  end_time: Date;
  location: any; // Contains name, description, lat, lon
  json_data: any;
  created_at: Date;
  updated_at: Date;
  activity_id: number;
  plan_day_place_id: number;

  constructor(data: any) {
    this.plan_schedule_id = data.plan_schedule_id;
    this.name = data.name;
    this.description = data.description;
    this.start_time = data.start_time ? new Date(data.start_time) : null;
    this.end_time = data.end_time ? new Date(data.end_time) : null;
    this.activity_id = data.activity_id;
    this.plan_day_place_id = data.plan_day_place_id;
    this.created_at = data.created_at ? new Date(data.created_at) : null;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : null;

    // Parse JSON fields if they are strings
    if (typeof data.json_data === 'string') {
      try {
        this.json_data = JSON.parse(data.json_data);
      } catch (e) {
        this.json_data = data.json_data || {};
      }
    } else {
      this.json_data = data.json_data || {};
    }

    // Parse location if it's a string
    if (typeof data.location === 'string') {
      try {
        this.location = JSON.parse(data.location);
      } catch (e) {
        this.location = data.location || {};
      }
    } else {
      this.location = data.location || {};
    }
  }
}

export class PlanWithGroup {
  plan_with_group_id: number;
  plan_id: number;
  group_id: number;
  user_created: number;
  created_at: Date;
  updated_at: Date;

  constructor(data: any) {
    this.plan_with_group_id = data.plan_with_group_id;
    this.plan_id = data.plan_id;
    this.group_id = data.group_id;
    this.user_created = data.user_created;
    this.created_at = data.created_at ? new Date(data.created_at) : null;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
  }
}
