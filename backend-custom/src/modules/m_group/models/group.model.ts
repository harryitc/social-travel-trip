export class Group {
  group_id: number;
  name: string;
  description?: string;
  cover_url?: string;
  status: string;
  json_data?: any;
  created_at: Date;
  updated_at: Date;
  plan_id?: number;

  constructor(data: any) {
    this.group_id = data.group_id;
    this.name = data.name;
    this.description = data.description;
    this.cover_url = data.cover_url;
    this.status = data.status;
    this.json_data = data.json_data;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.plan_id = data.plan_id;
  }
}

export class GroupMember {
  group_member_id: number;
  group_id: number;
  user_id: number;
  nickname?: string;
  role: string;
  join_at: Date;

  constructor(data: any) {
    this.group_member_id = data.group_member_id;
    this.group_id = data.group_id;
    this.user_id = data.user_id;
    this.nickname = data.nickname;
    this.role = data.role;
    this.join_at = data.join_at;
  }
}

export class GroupMessage {
  group_message_id: number;
  group_id: number;
  user_id: number;
  message: string;
  created_at: Date;
  updated_at: Date;
  like_count?: number;
  is_pinned?: boolean;

  constructor(data: any) {
    this.group_message_id = data.group_message_id;
    this.group_id = data.group_id;
    this.user_id = data.user_id;
    this.message = data.message;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.like_count = data.like_count;
    this.is_pinned = data.is_pinned;
  }
}

export class MessageLike {
  group_message_id: number;
  user_id: number;
  created_at: Date;
  reaction_id: number;

  constructor(data: any) {
    this.group_message_id = data.group_message_id;
    this.user_id = data.user_id;
    this.created_at = data.created_at;
    this.reaction_id = data.reaction_id;
  }
}

export class MessagePin {
  message_pin_id: number;
  group_message_id: number;
  group_id: number;
  user_id: number;
  created_at: Date;

  constructor(data: any) {
    this.message_pin_id = data.message_pin_id;
    this.group_message_id = data.group_message_id;
    this.group_id = data.group_id;
    this.user_id = data.user_id;
    this.created_at = data.created_at;
  }
}
