export class GroupInvitation {
  invitation_id: number;
  group_id: number;
  inviter_id: number;
  invited_user_id: number;
  status: 'pending' | 'accepted' | 'declined';
  invited_at: Date;
  responded_at?: Date;
  expires_at: Date;
  
  // Join data from queries
  group_name?: string;
  inviter_name?: string;
  inviter_avatar?: string;
  invited_user_name?: string;

  constructor(data: any) {
    this.invitation_id = data.invitation_id;
    this.group_id = data.group_id;
    this.inviter_id = data.inviter_id;
    this.invited_user_id = data.invited_user_id;
    this.status = data.status || 'pending';
    this.invited_at = data.invited_at ? new Date(data.invited_at) : new Date();
    this.responded_at = data.responded_at ? new Date(data.responded_at) : undefined;
    this.expires_at = data.expires_at ? new Date(data.expires_at) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default
    
    // Join data
    this.group_name = data.group_name;
    this.inviter_name = data.inviter_name;
    this.inviter_avatar = data.inviter_avatar;
    this.invited_user_name = data.invited_user_name;
  }

  static fromRow(row: any): GroupInvitation {
    return new GroupInvitation(row);
  }
}
