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
  join_code?: string;
  join_code_expires_at?: Date;
  members?: {
    count: number;
    max?: number;
    list: any[];
  };

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
    this.join_code = data.join_code;
    this.join_code_expires_at = data.join_code_expires_at;

    // Handle member count from query
    if (data.member_count != undefined) {
      this.members = {
        count: parseInt(data.member_count) || 0,
        max: 10, // Default max members
        list: [],
      };
    }
  }
}

export class GroupMember {
  group_member_id: number;
  group_id: number;
  user_id: number;
  nickname?: string;
  role: string;
  join_at: Date;
  // User information from join query
  username?: string;
  full_name?: string;
  avatar_url?: string;

  constructor(data: any) {
    this.group_member_id = data.group_member_id;
    this.group_id = data.group_id;
    this.user_id = data.user_id;
    this.nickname = data.nickname;
    this.role = data.role;
    this.join_at = data.join_at;
    // Map user information from join query
    this.username = data.username;
    this.full_name = data.full_name;
    this.avatar_url = data.avatar_url;
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
  // Reply information
  reply_to_message_id?: number;
  reply_to_message?: string;
  reply_to_username?: string;
  reply_to_nickname?: string;
  // User information from join query
  username?: string;
  full_name?: string;
  nickname?: string;
  avatar_url?: string;

  constructor(data: any) {
    this.group_message_id = data.group_message_id;
    this.group_id = data.group_id;
    this.user_id = data.user_id;
    this.message = data.message;

    // Ensure timestamps are properly formatted with timezone
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();

    this.like_count = data.like_count;
    this.is_pinned = data.is_pinned;
    // Map reply information
    this.reply_to_message_id = data.reply_to_message_id;
    this.reply_to_message = data.reply_to_message;
    this.reply_to_username = data.reply_to_username;
    this.reply_to_nickname = data.reply_to_nickname;
    // Map user information from join query
    this.username = data.username;
    this.full_name = data.full_name;
    this.nickname = data.nickname;
    this.avatar_url = data.avatar_url;
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
