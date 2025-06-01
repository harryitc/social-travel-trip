// Types for TripPlanEditor

export type ActivityType =
  | 'Ăn sáng'
  | 'Ăn trưa'
  | 'Ăn tối'
  | 'Cà phê'
  | 'Tham quan'
  | 'Mua sắm'
  | 'Nghỉ ngơi'
  | 'Di chuyển'
  | 'Khác';

export type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  mainLocation: string; // For chart display
  type?: ActivityType; // Loại hoạt động (tùy chọn)
};

export type Day = {
  id: string;
  date: Date | null; // Null for template, will be set when applied
  activities: Activity[];
};

export type TripPlan = {
  id: string;
  name: string;
  destination: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  description: string;
  duration: number; // Number of days
  image: string;
  tags: string[];
  days: Day[];
  authorId?: string;
  authorName?: string;
  isPublic: boolean;
  groupId?: string; // ID of the group this plan belongs to
  createdAt?: Date;
  updatedAt?: Date;
};

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';
