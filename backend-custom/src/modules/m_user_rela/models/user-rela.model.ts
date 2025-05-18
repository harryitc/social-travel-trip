export class UserRela {
  user_rela_id: number;
  user_id: number;
  following: number;
  created_at?: Date;

  constructor(data: any) {
    this.user_rela_id = data.user_rela_id;
    this.user_id = data.user_id;
    this.following = data.following;
    this.created_at = data.created_at;
  }
}

export class UserRelaWithDetails extends UserRela {
  username?: string;
  full_name?: string;
  avatar_url?: string;

  constructor(data: any) {
    super(data);
    this.username = data.username;
    this.full_name = data.full_name;
    this.avatar_url = data.avatar_url;
  }
}