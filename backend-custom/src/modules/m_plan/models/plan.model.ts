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

  constructor(data: Partial<Plan>) {
    Object.assign(this, data);
  }

  static create(data: Partial<Plan>): Plan {
    return new Plan(data);
  }
}

export class PlanDayPlace {
  plan_day_place_id: number;
  ngay: string; // Day number as string: '1', '2', etc.
  json_data: any;
  location: any; // Contains name, description, lat, lon
  plan_id: number;

  constructor(data: Partial<PlanDayPlace>) {
    Object.assign(this, data);
  }

  static create(data: Partial<PlanDayPlace>): PlanDayPlace {
    return new PlanDayPlace(data);
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

  constructor(data: Partial<PlanSchedule>) {
    Object.assign(this, data);
  }

  static create(data: Partial<PlanSchedule>): PlanSchedule {
    return new PlanSchedule(data);
  }
}

export class PlanWithGroup {
  plan_with_group_id: number;
  plan_id: number;
  group_id: number;
  user_created: number;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<PlanWithGroup>) {
    Object.assign(this, data);
  }

  static create(data: Partial<PlanWithGroup>): PlanWithGroup {
    return new PlanWithGroup(data);
  }
}
