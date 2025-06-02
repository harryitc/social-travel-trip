/**
 * Plan model class
 */
export class PlanModel {
  plan_id: number;
  name: string;
  description: string;
  thumbnail_url: string;
  json_data: any;
  location: any;
  status: string;
  user_created: number;
  created_at: Date;
  updated_at: Date;
  group_count?: number;

  constructor(data: any = {}) {
    this.plan_id = data.plan_id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
    this.thumbnail_url = data.thumbnail_url || '';
    this.json_data = data.json_data || {};
    this.location = data.location || {};
    this.status = data.status || 'private';
    this.user_created = data.user_created || 0;
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
    this.group_count = data.group_count || 0;
  }

  /**
   * Create array of PlanModel from response data
   */
  static fromResponseArray(data: any[]): PlanModel[] {
    return data.map(item => new PlanModel(item));
  }

  /**
   * Get formatted creation date
   */
  getFormattedCreatedDate(): string {
    return this.created_at.toLocaleDateString('vi-VN');
  }

  /**
   * Get plan tags
   */
  getTags(): string[] {
    return this.json_data?.tags || [];
  }

  /**
   * Check if plan is public
   */
  isPublic(): boolean {
    return this.status === 'public';
  }

  /**
   * Get location name
   */
  getLocationName(): string {
    return this.location?.name || 'Chưa có địa điểm';
  }
}

/**
 * Day place model class
 */
export class DayPlaceModel {
  plan_day_place_id: number;
  ngay: string;
  json_data: any;
  location: any;
  plan_id: number;
  schedules?: ScheduleModel[];

  constructor(data: any = {}) {
    this.plan_day_place_id = data.plan_day_place_id || 0;
    this.ngay = data.ngay || '1';
    this.json_data = data.json_data || {};
    this.location = data.location || {};
    this.plan_id = data.plan_id || 0;
    this.schedules = data.schedules ? ScheduleModel.fromResponseArray(data.schedules) : [];
  }

  /**
   * Create array of DayPlaceModel from response data
   */
  static fromResponseArray(data: any[]): DayPlaceModel[] {
    return data.map(item => new DayPlaceModel(item));
  }

  /**
   * Get day number as integer
   */
  getDayNumber(): number {
    return parseInt(this.ngay);
  }

  /**
   * Get location name
   */
  getLocationName(): string {
    return this.location?.name || 'Địa điểm';
  }

  /**
   * Get location description
   */
  getLocationDescription(): string {
    return this.location?.description || '';
  }

  /**
   * Get schedules count
   */
  getSchedulesCount(): number {
    return this.schedules?.length || 0;
  }
}

/**
 * Schedule model class
 */
export class ScheduleModel {
  plan_schedule_id: number;
  name: string;
  description: string;
  start_time: Date | null;
  end_time: Date | null;
  location: any;
  json_data: any;
  activity_id: number;
  plan_day_place_id: number;
  created_at: Date | null;
  updated_at: Date | null;

  constructor(data: any = {}) {
    this.plan_schedule_id = data.plan_schedule_id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
    this.start_time = data.start_time ? new Date(data.start_time) : null;
    this.end_time = data.end_time ? new Date(data.end_time) : null;
    this.location = data.location || {};
    this.json_data = data.json_data || {};
    this.activity_id = data.activity_id || 0;
    this.plan_day_place_id = data.plan_day_place_id || 0;
    this.created_at = data.created_at ? new Date(data.created_at) : null;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
  }

  /**
   * Create array of ScheduleModel from response data
   */
  static fromResponseArray(data: any[]): ScheduleModel[] {
    return data.map(item => new ScheduleModel(item));
  }

  /**
   * Get formatted start time
   */
  getFormattedStartTime(): string {
    if (!this.start_time) return '';
    return this.start_time.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Get formatted end time
   */
  getFormattedEndTime(): string {
    if (!this.end_time) return '';
    return this.end_time.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Get location name
   */
  getLocationName(): string {
    return this.location?.name || '';
  }

  /**
   * Check if schedule has time
   */
  hasTime(): boolean {
    return this.start_time !== null || this.end_time !== null;
  }

  /**
   * Get duration in minutes
   */
  getDurationMinutes(): number {
    if (!this.start_time || !this.end_time) return 0;
    return Math.floor((this.end_time.getTime() - this.start_time.getTime()) / (1000 * 60));
  }
}

/**
 * Plan details model class
 */
export class PlanDetailsModel {
  plan: PlanModel;
  dayPlaces: DayPlaceModel[];

  constructor(data: any = {}) {
    this.plan = new PlanModel(data.plan || {});
    this.dayPlaces = DayPlaceModel.fromResponseArray(data.dayPlaces || []);
  }

  /**
   * Get days count
   */
  getDaysCount(): number {
    const days = new Set(this.dayPlaces.map(dp => dp.ngay));
    return days.size;
  }

  /**
   * Get day places by day
   */
  getDayPlacesByDay(): Record<string, DayPlaceModel[]> {
    return this.dayPlaces.reduce((acc, dayPlace) => {
      if (!acc[dayPlace.ngay]) {
        acc[dayPlace.ngay] = [];
      }
      acc[dayPlace.ngay].push(dayPlace);
      return acc;
    }, {} as Record<string, DayPlaceModel[]>);
  }

  /**
   * Get sorted days
   */
  getSortedDays(): string[] {
    const days = new Set(this.dayPlaces.map(dp => dp.ngay));
    return Array.from(days).sort((a, b) => parseInt(a) - parseInt(b));
  }

  /**
   * Get total schedules count
   */
  getTotalSchedulesCount(): number {
    return this.dayPlaces.reduce((total, dayPlace) => {
      return total + (dayPlace.schedules?.length || 0);
    }, 0);
  }
}
