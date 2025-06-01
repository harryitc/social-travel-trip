// Backend DTOs (raw data from API)
export interface TripGroupMemberDTO {
  group_member_id: number;
  group_id: number;
  user_id: number;
  nickname?: string;
  role: 'admin' | 'member';
  join_at: string;
  // User information from join query (direct fields)
  username?: string;
  full_name?: string;
  avatar_url?: string;
  // Legacy nested user object (for backward compatibility)
  user?: {
    user_id: number;
    username: string;
    full_name?: string;
    avatar_url?: string;
    email?: string;
  };
}

export interface TripGroupDTO {
  group_id: number;
  name: string;
  title?: string; // For frontend compatibility
  description?: string;
  cover_url?: string;
  status: string;
  json_data?: any;
  created_at: string;
  updated_at: string;
  plan_id?: number;
  join_code?: string;
  join_code_expires_at?: string;
  members?: {
    count: number;
    max?: number;
    list: TripGroupMemberDTO[];
  };
  // Additional fields from join response
  success?: boolean;
  message?: string;
}

// Frontend Models (classes for UI)
export class TripGroupMember {
  public id: string;
  public name: string;
  public avatar: string;
  public role: 'admin' | 'member';
  public joinAt: Date;
  public nickname?: string;

  // Backend fields (kept for API calls)
  public group_member_id: number;
  public group_id: number;
  public user_id: number;

  constructor(dto: TripGroupMemberDTO) {
    this.group_member_id = dto.group_member_id;
    this.group_id = dto.group_id;
    this.user_id = dto.user_id;
    this.nickname = dto.nickname;
    this.role = dto.role;
    this.joinAt = new Date(dto.join_at);

    // Computed UI fields - prioritize nickname, then username, then fallback
    this.id = dto.group_member_id.toString();
    this.name = dto.nickname || dto.username || dto.user?.username || 'Unknown User';
    this.avatar = dto.avatar_url || dto.user?.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1';
  }

  // Helper methods
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  getDisplayName(): string {
    return this.nickname || this.name;
  }

  getFullDisplayInfo(): { displayName: string; username: string; fullName?: string } {
    return {
      displayName: this.nickname || this.name,
      username: this.name, // This contains the username
      fullName: (this as any).full_name // Access full_name if available
    };
  }
}

export class TripGroup {
  public id: string;
  public title: string;
  public description: string;
  public image: string;
  public location: string;
  public date?: string;
  public duration?: string;
  public hashtags: string[];
  public isPrivate: boolean;
  public hasPlan: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public members: {
    count: number;
    max: number;
    list: TripGroupMember[];
  };

  // Backend fields (kept for API calls)
  public group_id: number;
  public name: string;
  public cover_url?: string;
  public status: string;
  public json_data?: any;
  public plan_id?: number;
  public join_code?: string;
  public join_code_expires_at?: Date;

  constructor(dto: TripGroupDTO) {
    // console.log('🏗️ [TripGroup] Creating TripGroup from DTO:', {
    //   group_id: dto.group_id,
    //   name: dto.name,
    //   title: dto.title,
    //   hasTitle: !!dto.title,
    //   success: dto.success,
    //   message: dto.message
    // });

    // Backend fields
    this.group_id = dto.group_id;
    this.name = dto.name;
    this.description = dto.description || '';
    this.cover_url = dto.cover_url;
    this.status = dto.status;
    this.json_data = dto.json_data;
    this.plan_id = dto.plan_id;
    this.join_code = dto.join_code;
    this.join_code_expires_at = dto.join_code_expires_at ? new Date(dto.join_code_expires_at) : undefined;
    this.createdAt = new Date(dto.created_at);
    this.updatedAt = new Date(dto.updated_at);

    // UI computed fields
    this.id = dto.group_id.toString();
    this.title = dto.title || dto.name; // Use title if available, fallback to name
    this.image = dto.cover_url || '';
    this.isPrivate = dto.status === 'private';
    this.hasPlan = !!dto.plan_id;

    // Parse json_data for additional fields
    const jsonData = this.parseJsonData(dto.json_data);
    this.location = jsonData.location || '';
    this.date = jsonData.date;
    this.duration = jsonData.duration;
    this.hashtags = jsonData.hashtags || [];

    // Transform members - handle both members object and direct member_count
    this.members = {
      count: dto.members?.count || (dto as any).member_count || 0,
      max: dto.members?.max || 10,
      list: dto.members?.list?.map(memberDto => new TripGroupMember(memberDto)) || [],
    };

    console.log('🏗️ [TripGroup] Constructor - member count:', {
      fromMembers: dto.members?.count,
      fromMemberCount: (dto as any).member_count,
      finalCount: this.members.count,
      groupId: this.id,
      groupTitle: this.title
    });
  }

  private parseJsonData(jsonData: any): any {
    if (!jsonData) return {};

    if (typeof jsonData === 'string') {
      try {
        return JSON.parse(jsonData);
      } catch {
        return {};
      }
    }

    return jsonData;
  }

  // Helper methods
  isFull(): boolean {
    return this.members.count >= this.members.max;
  }

  canJoin(): boolean {
    return !this.isFull() && (!this.isPrivate || !!this.join_code);
  }

  getAdmins(): TripGroupMember[] {
    return this.members.list.filter(member => member.isAdmin());
  }

  getMemberById(userId: number): TripGroupMember | undefined {
    return this.members.list.find(member => member.user_id === userId);
  }

  addMember(member: TripGroupMember): void {
    this.members.list.push(member);
    this.members.count = this.members.list.length;
  }

  removeMember(userId: number): void {
    this.members.list = this.members.list.filter(member => member.user_id !== userId);
    this.members.count = this.members.list.length;
  }

  getLocationShort(): string {
    return this.location.split(',')[0] || this.location;
  }

  isExpired(): boolean {
    return this.join_code_expires_at ? new Date() > this.join_code_expires_at : false;
  }
}

// Input/Output DTOs for API calls
export class CreateTripGroupData {
  public title: string;
  public description?: string;
  public location?: string;
  public isPrivate?: boolean;
  public image?: string;

  constructor(data: {
    title: string;
    description?: string;
    location?: string;
    isPrivate?: boolean;
    image?: string;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.isPrivate = data.isPrivate || true; // Mặc định là riêng tư
    this.image = data.image;
  }

  // Transform to backend format
  toBackendDTO(): any {
    return {
      name: this.title,
      description: this.description,
      cover_url: this.image,
      json_data: {
        location: this.location,
      },
      status: this.isPrivate ? 'private' : 'public',
    };
  }
}

export class JoinTripGroupData {
  public qrCode: string;
  public userId?: string;

  constructor(data: { qrCode: string; userId?: string }) {
    this.qrCode = data.qrCode;
    this.userId = data.userId;
  }

  // Transform to backend format
  toBackendDTO(): any {
    return {
      join_code: this.qrCode,
    };
  }
}
