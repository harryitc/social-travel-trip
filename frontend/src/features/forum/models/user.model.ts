import { get } from "lodash";

export class UserRela {
  user_rela_id: number;
  user_id: number;
  following: number;
  created_at: Date;

  constructor(data: any) {
    this.user_rela_id = get(data, 'user_rela_id', -1);
    this.user_id = get(data, 'user_id', -1);
    this.following = get(data, 'following', -1);
    this.created_at = get(data, 'created_at', new Date());
  }
}

export class UserRelaWithDetails extends UserRela {
  username: string;
  full_name: string;
  avatar_url: string;

  constructor(data: any) {
    super(data);
    this.username = get(data, 'username', '');
    this.full_name = get(data, 'full_name', '');
    this.avatar_url = get(data, 'avatar_url', '');
  }
}
